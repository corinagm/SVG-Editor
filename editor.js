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
        this.currentMovingElement = null;
        this.stroke = document.getElementById('stroke');
        this.color = document.getElementById('color');
    }

    drawCircle() {

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
            circle.setAttribute('r', 65);

            let strokeWidth = 0;
            switch (this.stroke.value) {
                case 'thin': strokeWidth = 1; break;
                case 'middle': strokeWidth = 3; break;
                case 'thick': strokeWidth = 5; break;
            }
            circle.setAttribute('stroke-width', strokeWidth);

            switch (this.color.value) {
                case 'red': circle.setAttribute('fill', 'red'); break;
                case 'yellow': circle.setAttribute('fill', 'yellow'); break;
                case 'green': circle.setAttribute('fill', 'green'); break;
                case 'blue': circle.setAttribute('fill', 'blue'); break;
            }

            this.svg.appendChild(circle);
            this.objects.push(circle);
        }

        this.currentClickHandler = handler;

        this.svg.addEventListener("click", handler);
    }

    drawLine() {
        if (this.currentClickHandler)
            this.svg.removeEventListener("click", this.currentClickHandler);
        let handler = (e) => {

            //STARTING POINT
            const startingPt = this.svg.createSVGPoint();
            //coord
            startingPt.x = e.clientX + 50;
            startingPt.y = e.clientY + 50;

            const startingSvgPt = startingPt.matrixTransform(this.svg.getScreenCTM().inverse());

            // ENDING POINT
            const endingPt = this.svg.createSVGPoint();
            //coord
            endingPt.x = e.clientX - 50;
            endingPt.y = e.clientY - 50;

            const endingSvgPt = endingPt.matrixTransform(this.svg.getScreenCTM().inverse());

            //CREATING LINE
            const line = document.createElementNS(this.svgns, 'line');

            line.setAttribute('x1', startingSvgPt.x);
            line.setAttribute('x2', endingSvgPt.x);
            line.setAttribute('y1', startingSvgPt.y);
            line.setAttribute('y2', endingSvgPt.y);

            let strokeWidth = 0;
            switch (this.stroke.value) {
                case 'thin': strokeWidth = 4; break;
                case 'middle': strokeWidth = 7; break;
                case 'thick': strokeWidth = 10; break;
            }
            line.setAttribute('stroke-width', strokeWidth);


            switch (this.color.value) {
                case 'red': line.setAttribute('stroke', 'red'); break;
                case 'yellow': line.setAttribute('stroke', 'yellow'); break;
                case 'green': line.setAttribute('stroke', 'green'); break;
                case 'blue': line.setAttribute('stroke', 'blue'); break;
            }

            this.svg.appendChild(line);
            this.objects.push(line);
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
            rect.setAttribute('width', 60);
            rect.setAttribute('height', 80);
            // rect.id = "button";
            let strokeWidth = 0;
            switch (this.stroke.value) {
                case 'thin': strokeWidth = 1; break;
                case 'middle': strokeWidth = 3; break;
                case 'thick': strokeWidth = 5; break;

            }

            rect.setAttribute('stroke-width', strokeWidth);

            switch (this.color.value) {
                case 'red': rect.setAttribute('fill', 'red'); break;
                case 'yellow': rect.setAttribute('fill', 'yellow'); break;
                case 'green': rect.setAttribute('fill', 'green'); break;
                case 'blue': rect.setAttribute('fill', 'blue'); break;
            }

            this.svg.appendChild(rect);
            this.objects.push(rect);


        }

        this.currentClickHandler = handler;

        this.svg.addEventListener('click', handler);
    }

    onSelectedButtonClicked() {
        if (this.currentClickHandler)
            this.svg.removeEventListener("click", this.currentClickHandler);

        let handler = (e) => {
            if (this.objects) {
                for (let i = 0; i < this.objects.length; ++i) {
                    var nMouseOffsetX = 0;
                    var nMouseOffsetY = 0;

                    this.objects[i].addEventListener('click', (e) => {
                        console.log("element selectat");
                        this.currentSelectedElement = this.objects[i];
                    }, false);
                }
            }
        }
        this.currentClickHandler = handler;

        this.svg.addEventListener('click', handler);
    }

    moveTheElement() {
        if (this.currentClickHandler)
            this.svg.removeEventListener("click", this.currentClickHandler);

        let handler = (e) => {
            if (this.objects) {
                for (let i = 0; i < this.objects.length; ++i) {
                    var nMouseOffsetX = 0;
                    var nMouseOffsetY = 0;
                    var nMouseOffsetX2 = 0;
                    var nMouseOffsetY2 = 0;

                    //MOUSE DOWN    
                    this.objects[i].addEventListener("mousedown", (e) => {
                        this.isAnyObjectMoving = true;
                        console.log("mouseDown");
                        let p = this.svg.createSVGPoint();
                        p.x = e.clientX;
                        p.y = e.clientY;
                        let tagName = this.objects[i].tagName;

                        if (tagName == "circle") {
                            var element = this.objects[i].getScreenCTM();
                            p = p.matrixTransform(element.inverse());
                            nMouseOffsetX = p.x - parseInt(this.objects[i].getAttribute("cx"));
                            nMouseOffsetY = p.y - parseInt(this.objects[i].getAttribute("cy"));
                        }
                        else if (tagName == "rect") {
                            var element = this.objects[i].getScreenCTM();
                            p = p.matrixTransform(element.inverse());
                            nMouseOffsetX = p.x - parseInt(this.objects[i].getAttribute("x"));
                            nMouseOffsetY = p.y - parseInt(this.objects[i].getAttribute("y"));

                        }
                        else if (tagName == "line") {
                            let p1 = this.svg.createSVGPoint();
                            let p2 = this.svg.createSVGPoint();

                            p1.x = e.clientX + 50;
                            p1.y = e.clientY + 50;
                            p2.x = e.clientX - 50;
                            p2.y = e.clientY - 50;

                            let tagName = this.objects[i].tagName;


                            var element = this.objects[i].getScreenCTM();
                            p1 = p1.matrixTransform(element.inverse());

                            nMouseOffsetX = p1.x - parseInt(this.objects[i].getAttribute("x1"));
                            nMouseOffsetY = p1.y - parseInt(this.objects[i].getAttribute("y1"));
                            nMouseOffsetX2 = p2.x - parseInt(this.objects[i].getAttribute("x2"));
                            nMouseOffsetY2 = p2.y - parseInt(this.objects[i].getAttribute("y2"));
                        }
                    });

                    //MOUSE MOVE
                    this.objects[i].addEventListener("mousemove", (e) => {

                        console.log("mouseMove");

                        if (this.isAnyObjectMoving) {
                            if (this.objects[i]) {
                                let tagName = this.objects[i].tagName;
                                if (tagName == "circle") {
                                    let p = this.svg.createSVGPoint();
                                    p.x = e.clientX;
                                    p.y = e.clientY;

                                    var element = this.objects[i].getScreenCTM();
                                    p = p.matrixTransform(element.inverse());
                                    this.objects[i].setAttribute("cx", p.x - nMouseOffsetX);
                                    this.objects[i].setAttribute("cy", p.y - nMouseOffsetY);
                                }
                                else if (tagName == "rect") {
                                    let p = this.svg.createSVGPoint();
                                    p.x = e.clientX;
                                    p.y = e.clientY;

                                    var element = this.objects[i].getScreenCTM();
                                    p = p.matrixTransform(element.inverse());
                                    this.objects[i].setAttribute("x", p.x - nMouseOffsetX);
                                    this.objects[i].setAttribute("y", p.y - nMouseOffsetY);
                                }
                                else if (tagName == "line") {
                                    let p1 = this.svg.createSVGPoint();
                                    p1.x = e.clientX;
                                    p1.y = e.clientY;

                                    let p2 = this.svg.createSVGPoint();
                                    p2.x = e.clientX - 50;
                                    p2.y = e.clientY - 50;

                                    var element = this.objects[i].getScreenCTM();
                                    p1 = p1.matrixTransform(element.inverse());

                                    this.objects[i].setAttribute("x1", p1.x - nMouseOffsetX);
                                    this.objects[i].setAttribute("y1", p1.y - nMouseOffsetY);
                                    this.objects[i].setAttribute("x2", p1.x - nMouseOffsetX2);
                                    this.objects[i].setAttribute("y2", p1.y - nMouseOffsetY2);
                                }

                            }
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
        this.currentClickHandler = handler;

        this.svg.addEventListener('click', handler);
    }

    onDeleteClicked() {
        if (this.currentSelectedElement)
            this.currentSelectedElement.remove();
    }
}
