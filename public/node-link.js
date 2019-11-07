var width = 1200,
height = 660;
margin = 10

var xscale = d3.scaleLinear()
    .range([250, width-margin]);

var yscale = d3.scaleLinear()
    .range([margin,height-margin])

var meter = document.querySelector("#progress")
var	svg = d3.select("body")
.append("svg")
    .attr("width", width)
    .attr("height", height)
    
svg.append("text")
    .attr('id', "load")
    .text("Loading")
    .attr('x', width/2)
    .attr('y', height/2)


var color = d3.scaleSequential(d3.interpolateSpectral);

var worker = new Worker("worker.js");

d3.json("links2016.json", function(error, graph) {
    if (error) throw error;
    var exclusion_list = []
    var theme_ids = []

    themes = graph.themes

    themes.forEach(function(theme) {
        theme_ids.push(theme.id)
    })

    square_dimension = 500/themes.length

    var legend = svg.append("g")
            .attr("class", "legend")
            .selectAll("square")
            .data(themes).enter()
            
    legend.append('rect')
        .attr('x', 10)
        .attr('y', function(d, i) { return ((i+1)*square_dimension*1.1)})
        .attr('width', square_dimension)
        .attr('height', square_dimension)
        .style("fill", function(d) { return(color(theme_ids.indexOf(d.id)/theme_ids.length))})
        .style("stroke", function(d) { return(color(theme_ids.indexOf(d.id)/theme_ids.length))})
        .on("click", function(d){
            var nextColor = 'white';
            if (this.style.fill == "white"){
                nextColor = color(theme_ids.indexOf(d.id)/theme_ids.length);
                var index = exclusion_list.indexOf(d.id);
                exclusion_list.splice(index, 1);
            }
            else {
                nextColor = 'white'
                exclusion_list.push(d.id)
            }
            console.log(exclusion_list)
            d3.select(this).style("fill", nextColor);});
            
    legend.append('text')
        .text( function(d) { return d.name })
        .attr('x', 15+square_dimension)
        .attr('y', function(d, i) { return ((i+1)*square_dimension*1.1)+square_dimension})

    var updateButton = svg.append('g')
        .attr('class', 'updateButton')
    
    updateButton.append('rect')
        .attr('x', 10)
        .attr('y', ((themes.length+6)*square_dimension))
        .attr('width', square_dimension*12)
        .attr('height', square_dimension*3)
        .style('fill', 'white')
        .style('stroke', 'black')
        .on("click", function(d){ updateVis() });

    function updateVis(){
        svg.append("text")
            .attr('id', "load")
            .text("Loading")
            .attr('x', 200)
            .attr('y', 30)

        console.log(exclusion_list)
        console.log(graph.nodes[0].theme)
        new_nodes = graph.nodes.filter(function(d) { return !exclusion_list.includes(d.theme) })
        new_links = graph.links.filter(function(d) { 
            var found_source = false;
            var found_target = false;
            for (var i = 0; i<new_nodes.length; i++){
                if (d.source === new_nodes[i].id){
                    found_source = true;
                }
                if(d.target === new_nodes[i].id){
                    found_target = true;
                }
                if (found_source && found_target){
                    return true;
                }
            }
            return false;
        })
        worker.postMessage({
            nodes: new_nodes,
            links: new_links
        });
        meter.style.width = 0 + "%";
        meter.style.display = "block";
    }

    updateButton.append('text')
        .attr('x', 13)
        .attr('y', ((themes.length+8)*square_dimension))
        .text('Update Visualisation')
        .on("click", function(d){ updateVis() });

    worker.postMessage({
        nodes: graph.nodes,
        links: graph.links
    });

    worker.onmessage = function(event) {
        switch (event.data.type) {
            case "tick": return ticked(event.data);
            case "end": return ended(event.data, graph.themes);
        }
    };

    function ticked(data) {
        var progress = data.progress;
        meter.style.width = 100 * progress + "%";
    }

    function ended(data, themes) {

        var nodes = data.nodes,
            links = data.links;
        
        console.log(nodes[0])

        var maxX = Math.max.apply(Math,nodes.map(function(o){return o.x;})),
        minX = Math.min.apply(Math,nodes.map(function(o){return o.x;})),
        maxY = Math.max.apply(Math,nodes.map(function(o){return o.y;})),
        minY = Math.min.apply(Math,nodes.map(function(o){return o.y;}))

        xscale.domain([minX, maxX])
        yscale.domain([minY,maxY])
        
        
        meter.style.display = "none";
        svg.select("#load").remove();
        svg.select("#links").remove();
        svg.select("#nodes").remove();

        var link = svg.append("g")
            .attr("class", "links")
            .attr('id', "links")
            .selectAll("line")
            .data(links).enter()
                .append("line")
                .attr("stroke-opacity", function(d) { return Math.sqrt(d.weight)/10; })
                .attr("stroke", "black")
                .attr("x1", function(d) { return xscale(d.source.x); })
                .attr("y1", function(d) { return yscale(d.source.y); })
                .attr("x2", function(d) { return xscale(d.target.x); })
                .attr("y2", function(d) { return yscale(d.target.y); });
        
        var node = svg.append("g")
            .attr("class", "nodes")
            .attr('id', "nodes")
            .selectAll("circle")
            .data(nodes)
            .enter().append("circle")
                .attr("r", 5)
                .attr("fill", function(d) { return color(theme_ids.indexOf(d.theme)/theme_ids.length); })
                .attr("cx", function(d) { return xscale(d.x); })
                .attr("cy", function(d) { return yscale(d.y); })
                .style("stroke", "black")
            .append("title")
                .text(function(d) { return d.name+ ' || ' + d.theme_name + ' || ' + d.id; })
        
        console.log("all done")
    }
});