/*class RectangleElement {
    constructor(element) {
        this.element = element;
        this.svgns = "http://www.w3.org/2000/svg";
    }
    drawRect(x, y) {
        this.createRect();
        this.element.appendChild(this.svg);
    }
    createRect() {
        this.svg = document.createElementNS(this.svgnsm, 'rect');
    }

}*/



class DrawingManager {



    constructor(domElement) {
        this.domElement = domElement;

        this.svgns = "http://www.w3.org/2000/svg";
        this.svg = document.createElementNS(this.svgns, "svg");
        this.domElement.appendChild(this.svg);

        this.width = this.domElement.clientWidth;
        this.height = this.domElement.clientHeight;
        this.svg.setAttribute('width', "100%"); //note: this.svg.width is readonly
        this.svg.setAttribute('height', "400");
        this.svg.setAttribute('style', 'border-top: 2px solid black; border-bottom: 2px solid black');


        this.currentClickHandler = null;
        this.objects = [];
        this.currentSelectedElement = null;
        this.isAnyObjectMoving = false;
    }




    drawCircle() {
        //this.svg.removeEventListener("click");
        if (this.currentClickHandler)
            this.svg.removeEventListener("click", this.currentClickHandler);

        let handler = (e) => {
            const pt = this.svg.createSVGPoint();
            //coord
            pt.x = e.clientX;
            pt.y = e.clientY;

            const svgP = pt.matrixTransform(this.svg.getScreenCTM().inverse());

            const circle = document.createElementNS(this.svgns, 'circle');
            circle.setAttribute('cx', svgP.x);
            circle.setAttribute('cy', svgP.y);
            circle.setAttribute('r', 40);
            circle.setAttribute('stroke-width',5);

            this.svg.appendChild(circle);
            this.objects.push(circle);


        }

        this.currentClickHandler = handler;

        this.svg.addEventListener("click", handler);
    }

    drawLine() {
        if (this.currentClickHandler)
            this.svg.removeEventListener("click", this.currentClickHandler);
        let handler = (e1, e2) => {

            //STARTING POINT
            const startingPt = this.svg.createSVGPoint();
            //coord
            startingPt.x = e1.clientX;
            startingPt.y = e1.clientY;

            const startingSvgPt = startingPt.matrixTransform(this.svg.getScreenCTM().inverse());

            // ENDING POINT
            const endingPt = this.svg.createSVGPoint();
            //coord
            endingPt.x = e2.clientX;
            endingPt.y = e2.clientY;

            const endingSvgPt = endingPt.matrixTransform(this.svg.getScreenCTM().inverse());

            //CREATING LINE
            const line = document.createElementNS(this.svgns, 'line');
            line.setAttribute('x1', startingSvgPt.x);
            line.setAttribute('x2', endingSvgPt.x);
            line.setAttribute('y1', startingSvgPt.y);
            line.setAttribute('y2', endingSvgPt.y);
            line.setAttribute('stroke-width', 5);
            line.setAttribute('stroke', blue);



            this.svg.appendChild(line);
            this.objects.push(circle);
        }
        this.currentClickHandler = handler;

        this.svg.addEventListener("click", handler);
    }

    drawRect() {
        if (this.currentClickHandler)
            this.svg.removeEventListener("click", this.currentClickHandler);

        let handler = (e) => {
            const pt = this.svg.createSVGPoint();
            //coord
            pt.x = e.clientX;
            pt.y = e.clientY;

            const svgP = pt.matrixTransform(this.svg.getScreenCTM().inverse());

            const rect = document.createElementNS(this.svgns, 'rect');
            rect.setAttribute('x', svgP.x);
            rect.setAttribute('y', svgP.y);
            rect.setAttribute('width', 30);
            rect.setAttribute('height', 50);
            rect.id = "button";

            // rect.setColor('fill',rgb(0,0,255));

            this.svg.appendChild(rect);
            this.objects.push(rect);


        }
        
        this.currentClickHandler = handler;

        this.svg.addEventListener('click', handler);
    }

    // onElementSelected(e)
    // {
    //     console.log("element selectat");
    //     this.currentSelectedElement = this;
    // }

    onSelectedButtonClicked() {
        if (this.currentClickHandler)
            this.svg.removeEventListener("click", this.currentClickHandler);

        if (this.objects) {
            for (let i = 0; i < this.objects.length; ++i) {
                var nMouseOffsetX = 0;
                var nMouseOffsetY = 0;


                this.objects[i].addEventListener('click', (e) => {
                    console.log("element selectat");
                    this.currentSelectedElement = this.objects[i];
                }, false);

                //MOUSE DOWN    
                this.objects[i].addEventListener("mousedown", (e) => {
                    this.isAnyObjectMoving = true;
                    console.log("mouseDown");
                    let p = this.svg.createSVGPoint();
                    p.x = e.clientX;
                    p.y = e.clientY;
                    
                   // if(this.objects[i].tagNAme=="rect")
                    var element = this.objects[i].getScreenCTM();
                    p = p.matrixTransform(element.inverse());
                    nMouseOffsetX = p.x - parseInt(this.objects[i].getAttribute("x"));
                    nMouseOffsetY = p.y - parseInt(this.objects[i].getAttribute("y"));
                });

                //MOUSE MOVE
                this.objects[i].addEventListener("mousemove", (e) => {
                    
                    if(this.isAnyObjectMoving)
                    {
                        console.log("mouseMove");

                        let p = this.svg.createSVGPoint();
                        p.x = e.clientX;
                        p.y = e.clientY;
                        var bClient = true;

                        var element = this.objects[i].getScreenCTM();
                        p = p.matrixTransform(element.inverse());
                        this.objects[i].setAttribute("x", p.x - nMouseOffsetX);
                        this.objects[i].setAttribute("y", p.y - nMouseOffsetY);
                        bClient = false;
                    }
                    
                });


                //MOUSE UP  
                this.objects[i].addEventListener("mouseup", (e) => { 
                    console.log("mouseUp");
                    this.isAnyObjectMoving = false; 
                });

            }
        }
    }


    displayCoords(x, y, extra) {
        var xNode = document.getElementById("xpos");
        var yNode = document.getElementById("ypos");
        if (xNode && yNode) {
            xNode.firstChild.nodeValue = parseInt(x) + extra;
            yNode.firstChild.nodeValue = parseInt(y) + extra;
        }
    }
    
    onDeleteClicked() {
        if (this.currentSelectedElement)
            this.currentSelectedElement.remove();
    }



}
