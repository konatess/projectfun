var draw = SVG('display').size(200, 200)



var path = draw.path('M0 0 A50 50 0 0 1 50 50 A50 50 0 0 0 100 100')

path.fill('none').move(20, 20).stroke({ width: 1, color: '#ccc' })
