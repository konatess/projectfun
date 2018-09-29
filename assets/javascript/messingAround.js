var graph = new joint.dia.Graph;

        var paper = new joint.dia.Paper({
            el: document.getElementById('myholder'),
            model: graph,
            width: 600,
            height: 600,
            gridSize: 1,
            interactive: { elementMove: false, arrowheadMove: false }
        });

        

        var rect = new joint.shapes.standard.Circle();
        rect.position(100, 30);
        rect.resize(50, 50);
        rect.attr({
            body: {
                fill: '../images/monster.svg'
            },
            label: {
                text: 'Hello',
                fill: 'white'
            }
        });
        rect.addTo(graph);

        var rect2 = rect.clone();
        rect2.position(200, 30);
        rect2.attr('label/text', 'World!');
        rect2.addTo(graph);

        paper.on('element:pointerclick', function(cellView) {
            var isElement = cellView.model.isElement();
            var message = (isElement ? 'Element' : 'Link') + ' clicked';
            alert(message)
        });


        var borderedImage = new joint.shapes.standard.BorderedImage();
        borderedImage.resize(50, 50);
        borderedImage.position(225, 410);
        borderedImage.attr('root/title', 'joint.shapes.standard.BoarderedImage');
        borderedImage.attr('label/text', 'Monster\nImage');
        borderedImage.attr('border/rx', "0%");
        borderedImage.attr('image/xlinkHref', './assets/images/monster.svg');
        borderedImage.addTo(graph);



joint.shapes.devs.MyImageModel = joint.shapes.devs.Model.extend({

    markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',

    defaults: joint.util.deepSupplement({

        type: 'devs.MyImageModel',
        size: { width: 100, height: 100 },
        attrs: {
            '.port-body': {
                r: 50,
                magnet: true,
                stroke: '#000000'
            },
        //    rect: { stroke: '#d1d1d1', fill: { type: 'linearGradient', stops: [{offset: '0%', color: 'white'}, {offset: '50%', color: '#d1d1d1'}], attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' } } },
        //    circle: { stroke: 'gray' },
            // '.inPorts circle': { fill: '' },
            // '.outPorts circle': { fill: '' },
            image: { 'xlink:href': './assets/images/monster.svg', width: 100, height: 100, 'ref-x': .5, 'ref-y': .5, ref: 'rect', 'x-alignment': 'middle', 'y-alignment': 'middle' }
        }

    }, joint.shapes.devs.Model.prototype.defaults)
});

var imageModel = new joint.shapes.devs.MyImageModel({
    position: { x: 10, y: 190 },
    size: { width: 100, height: 100 },
    r: 50
    // inPorts: [''],
    // outPorts: ['']
});
graph.addCell(imageModel);


joint.dia.Element.define('standard.Rectangle', {
    attrs: {
        body: {
            refWidth: '100%',
            refHeight: '100%',
            strokeWidth: 2,
            stroke: '#000000',
            fill: '#FFFFFF'
        },
        label: {
            textVerticalAnchor: 'middle',
            textAnchor: 'middle',
            refX: '50%',
            refY: '50%',
            fontSize: 14,
            fill: '#333333'
        }
    }
}, {
    markup: [{
        tagName: 'circle',
        selector: 'body',
    }, {
        tagName: 'text',
        selector: 'label'
    }]
});

        // function createFields() {
        //     $('.field').remove();
        //     var container = $('.display');
        //     //NOTE: when we generate these guys, we need to give them an onclick so they will open an editing modal 
        //     //and the user can then put in the name and pick an image
        //     for(var i = 0; i < userRuleset.allNodes.length; i++) { //NOTE: we may want a better way to reference the nodes
        
        //         var newCircle = $("<div>");
        //         newCircle.addClass('field border border-dark rounded-circle text-dark text-center bg-light position-absolute p-3');
        //         newCircle.text(i + " " + userRuleset.allNodes[i]['name']); //DEBUGGING: added i (the index) to the page
        //         newCircle.attr("data-index", i);
        //         newCircle.on("click", function(){
        //             var myIndex = parseInt($(this).attr("data-index"));
        //             console.log("I am " + myIndex);
        //         });
        //         container.append(newCircle);
        //         console.log(userRuleset.allNodes[i]['name'])
        //     }
        //   }
        
        //   function distributeFields() {
        //     var radius = 250;
        //     var fields = $('.field'), container = $('.display'),
        //         width = container.width(), height = container.height(),
        //         // for reasons I have yet to understand, angle 4.72 puts the first item closest to the top
        //         angle = 4.72, step = (2*Math.PI) / fields.length;
        //         console.log("Width: " + width, "Height: " + height)
        //     fields.each(function() {
        //         var x = Math.round(width/2 + radius * Math.cos(angle) - $(this).width()/2);
        //         var y = Math.round(height/2 + radius * Math.sin(angle) - $(this).height()/2);
        //         if(window.console) {
        //             console.log($(this).text(), x, y);
        //         }
        //         $(this).css({
        //             left: x + 'px',
        //             top: y + 75 + 'px'
        //         });
        //         angle += step;
        //     });
        //   }
          
        //   createFields();
        //   distributeFields();

        var link = new joint.shapes.standard.Link();
        link.source(rect);
        link.target(rect2);
        link.addTo(graph);