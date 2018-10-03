// var graph = new joint.dia.Graph;
// var paper = new joint.dia.Paper({ el: document.getElementById('myholder'), width: 650, height: 400, model: graph });

// joint.shapes.fsa.MyState = joint.shapes.fsa.State.extend({

//     markup: [
//         '<g class="rotatable"><g class="scalable">',
//         '<clipPath id="clip-top1"><rect cx="-30" cy="0" width="60" height="30"/></clipPath>',
//         '<clipPath id="clip-top2"><rect cx="-30" cy="15" width="60" height="15"/></clipPath>',
//         '<circle class="a"/><circle class="b"/><circle class="c"/>',
//         '</g><text/></g>'
//     ].join(''),

//     defaults: joint.util.deepSupplement({
//         type: 'fsa.MyState',
//         size: { width: 60, height: 60 },
//         attrs: {
//             'circle': { fill: 'white' },
//             '.b': { fill: 'red', 'clip-path': 'url(#clip-top1)' },
//             '.c': { fill: 'blue', 'clip-path': 'url(#clip-top2)' }
//         }
//     }, joint.shapes.fsa.State.prototype.defaults)
// });

// var mystate1 = new joint.shapes.fsa.MyState({
//     position: { x: 50, y: 50 },
//     size: { width: 100, height: 100 },
//     attrs: { text: { text: 'my state 1' } }
// });
// graph.addCell(mystate1);

// var mystate2 = new joint.shapes.fsa.MyState({
//     position: { x: 50, y: 160 },
//     size: { width: 50, height: 50 }
// });
// graph.addCell(mystate2);







var graph = new joint.dia.Graph;

        var paper = new joint.dia.Paper({
            el: document.getElementById('myholder'),
            model: graph,
            width: 600,
            height: 600,
            gridSize: 1,
            // makes code not draggable
            interactive: { elementMove: false, arrowheadMove: false },
            pointerEvents: 'none',
            // defs: {
            //     '<clipPath id="myClip"><circle cx="40" cy="35" r="35" /></clipPath>'
            // }
        });

        // // var nodeMask = new joint.dia.Paper.prototype.properties({
            
        // // })

        
        // var rect = new joint.shapes.standard.Circle();
        // rect.position(100, 30);
        // rect.resize(50, 50);
        // rect.attr({
        //     body: {
        //         fill: './assets/images/monster.svg'
        //     },
        //     label: {
        //         text: 'Hello',
        //         fill: 'white'
        //     }
        // });
        // rect.addTo(graph);

        // // clone duplicates the referenced image, and then each of the lined below it modifies it.
        // var rect2 = rect.clone();
        // rect2.position(200, 30);
        // rect2.attr('label/text', 'World!');
        // rect2.addTo(graph);

        // // code to make the elements clickable. 
        // // This makes all elements clickable, 
        // // so we need this function to return info about what was clicked
        // paper.on('element:pointerclick', function(cellView) {
        //     var isElement = cellView.model.isElement();
        //     var message = (isElement ? 'Element' : 'Link') + ' clicked';
        //     alert(message)
        // });

        // joint.shapes.Element.define('standard.BorderedImage', {
        //     attrs: {
        //         body: {
        //             rx: "50%"
        //         }
        //     },
        //     markup: [{
        //         tagName: 'rect',
        //         selector: 'body',
        //     }, {
        //         tagName: 'text',
        //         selector: 'label'
        //     }]
        // })


        var borderedImage = new joint.shapes.standard.BorderedImage();
        borderedImage.resize(100, 100);
        borderedImage.position(100, 100);
        borderedImage.attr('root/title', 'joint.shapes.standard.BoarderedImage');
        borderedImage.attr('label/text', 'Monster\nImage');
        borderedImage.attr('border/rx', "50%");
        // borderedImage.attr('overflow', 'hidden');
        borderedImage.attr('image/xlinkHref', './assets/images/monster.svg');
        // borderedImage.properties({
        //     markup: [
        //         '<g class="rotatable scalable">',
        //             '<clipPath id="myClip">',
        //                 '<circle cx="40" cy="35" r="35" />',
        //             '</clipPath>',
        //         '</g>'
        //     ].join(''),
        // })
        borderedImage.addTo(graph);


var image = new joint.shapes.standard.Image({
    position : {
        x : 50,
        y : 40
    },
    size : {
        width : 100,
        height : 100,
        r: 50
    },
    attrs : {
        image : {
            "xlink:href" : './assets/images/monster.svg',
            width : 100,
            height : 100,
        },
        body: {
            rx: 50,
            ry:50
        }
    }
});

graph.addCell(image);


// joint.shapes.devs.MyImageModel = joint.shapes.devs.Model.extend({

//     markup: '<g class="rotatable"><g class="scalable"><rect class="body"/></g><image/><text class="label"/><g class="inPorts"/><g class="outPorts"/></g>',

//     defaults: joint.util.deepSupplement({

//         type: 'devs.MyImageModel',
//         size: { width: 100, height: 100 },
//         attrs: {
//             '.port-body': {
//                 rx: 50,
//                 magnet: true,
//                 stroke: '#000000'
//             },
//         //    rect: { stroke: '#d1d1d1', fill: { type: 'linearGradient', stops: [{offset: '0%', color: 'white'}, {offset: '50%', color: '#d1d1d1'}], attrs: { x1: '0%', y1: '0%', x2: '0%', y2: '100%' } } },
//         //    circle: { stroke: 'gray' },
//             // '.inPorts circle': { fill: '' },
//             // '.outPorts circle': { fill: '' },
//             image: { 'xlink:href': './assets/images/monster.svg', width: 100, height: 100, 'ref-x': .5, 'ref-y': .5, ref: 'rect', 'x-alignment': 'middle', 'y-alignment': 'middle' }
//         }

//     }, joint.shapes.devs.Model.prototype.defaults)
// });

// var imageModel = new joint.shapes.devs.MyImageModel({
//     position: { x: 10, y: 190 },
//     size: { width: 100, height: 100 },
//     rx: 50
//     // inPorts: [''],
//     // outPorts: ['']
// });
// graph.addCell(imageModel);


// joint.dia.Element.define('standard.Rectangle', {
//     attrs: {
//         body: {
//             refWidth: '100%',
//             refHeight: '100%',
//             strokeWidth: 2,
//             stroke: '#000000',
//             fill: '#FFFFFF'
//         },
//         label: {
//             textVerticalAnchor: 'middle',
//             textAnchor: 'middle',
//             refX: '50%',
//             refY: '50%',
//             fontSize: 14,
//             fill: '#333333'
//         }
//     }
// }, {
//     markup: [{
//         tagName: 'circle',
//         selector: 'body',
//     }, {
//         tagName: 'text',
//         selector: 'label'
//     }]
// });

//         // function createFields() {
//         //     $('.field').remove();
//         //     var container = $('.display');
//         //     //NOTE: when we generate these guys, we need to give them an onclick so they will open an editing modal 
//         //     //and the user can then put in the name and pick an image
//         //     for(var i = 0; i < userRuleset.allNodes.length; i++) { //NOTE: we may want a better way to reference the nodes
        
//         //         var newCircle = $("<div>");
//         //         newCircle.addClass('field border border-dark rounded-circle text-dark text-center bg-light position-absolute p-3');
//         //         newCircle.text(i + " " + userRuleset.allNodes[i]['name']); //DEBUGGING: added i (the index) to the page
//         //         newCircle.attr("data-index", i);
//         //         newCircle.on("click", function(){
//         //             var myIndex = parseInt($(this).attr("data-index"));
//         //             console.log("I am " + myIndex);
//         //         });
//         //         container.append(newCircle);
//         //         console.log(userRuleset.allNodes[i]['name'])
//         //     }
//         //   }
        
//         //   function distributeFields() {
//         //     var radius = 250;
//         //     var fields = $('.field'), container = $('.display'),
//         //         width = container.width(), height = container.height(),
//         //         // for reasons I have yet to understand, angle 4.72 puts the first item closest to the top
//         //         angle = 4.72, step = (2*Math.PI) / fields.length;
//         //         console.log("Width: " + width, "Height: " + height)
//         //     fields.each(function() {
//         //         var x = Math.round(width/2 + radius * Math.cos(angle) - $(this).width()/2);
//         //         var y = Math.round(height/2 + radius * Math.sin(angle) - $(this).height()/2);
//         //         if(window.console) {
//         //             console.log($(this).text(), x, y);
//         //         }
//         //         $(this).css({
//         //             left: x + 'px',
//         //             top: y + 75 + 'px'
//         //         });
//         //         angle += step;
//         //     });
//         //   }
          
//         //   createFields();
//         //   distributeFields();

//         var link = new joint.shapes.standard.Link();
//         link.source(rect);
//         link.target(rect2);
//         link.addTo(graph);


        