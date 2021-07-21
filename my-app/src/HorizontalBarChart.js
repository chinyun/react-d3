import React, {useState, useEffect, useRef} from 'react';
import { scaleLinear, scaleBand, select, axisBottom, axisLeft, max, format} from 'd3';

const HorizontalBarChart = ({kcode}) => {

    const [data, setData] = useState([])
    const svgRef = useRef();
    const [width, setWidth] = useState(470)
    const [height, setHeight] = useState(370)

    const getMarketplaceOrders = () => {
        // call get real data request should be done here
        // testing data
        const mpOrders = [
            {marketplace: 'Amazon.com', orders: 20},
            {marketplace: 'Amazon.fr', orders: 18},
            {marketplace: 'Amazon.de', orders: 20},
            {marketplace: 'Amazon.it', orders: 18},
            {marketplace: 'Amazon.au', orders: 18}
        ]
        setData(mpOrders)
    }
    let colorScale = scaleLinear()
        .domain([0, data.length])
        .range(['rgba(13, 133, 252, 1)', 'rgba(13, 133, 252, 0.2)'])
    
    // console.log(data.map((d, i )=>colorScale(i)))

    const margin = {top: 20, right: 30, bottom: 50, left: 100};
    const w = width - margin.left - margin.right;
    const h = height - margin.top - margin.bottom;

    let xScale = scaleLinear()
        .domain([0, max(data, d => d.orders)])
        .range([0, w]);

    let yScale = scaleBand()
        .range([ 0, h ])
        .domain(data.map(function(d) { return d.marketplace; }))
        .paddingInner(data.length < 5 ? 0.5 : 0.1)
        .paddingOuter(data.length < 5 ? 0.5 : 0.1)
        // .padding(.1);

    const renderChart = () => {
        const svg = select(svgRef.current);
        const group = svg.append('g')
            .attr('class', 'rect-group')
            .attr('transform', `translate(${margin.left},${margin.top} )`)     

        group.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", xScale(0) )
            .attr("y", function(d) { return yScale(d.marketplace); })
            .attr("width", function(d) { return xScale(d.orders); })
            .attr("height", yScale.bandwidth() )
            .attr("fill", (d, i) => colorScale(i))
            // .attr("fill", function(d) {
            //     return "rgb("+ Math.round(d.orders * 4) + ",112," + Math.round(d.orders+230 ) + ")";
            // });
       
        const xAxis = axisBottom(xScale).tickFormat(format('d'));
        if (xScale.domain() [1] < 10) {
            xAxis.ticks(xScale.domain()[1])
        }
        
        svg.select(".x-axis")
            // .attr("transform", "translate(0," + h + ")")
            .attr("transform",`translate(${margin.left}, ${h + margin.top + 5})`)
            .call(xAxis)

        const yAxis = axisLeft(yScale);
        svg.select('.y-axis')
            .attr("transform", `translate(${margin.left - 5}, ${margin.top})`)
            .call(yAxis)
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
        
        // svg.append('text')
        //     .attr('class', 'y-label')
        //     .attr('x', -(height / 2))
        //     .attr('y', 20)
        //     .attr('transform', 'rotate(-90)')
        //     .attr('text-anchor', 'middle')
        //     .text('Marketplace')
        
        svg.append('text')
            .attr('class', 'x-label')
            .attr('x', width / 2 + 30)
            .attr('y', height - 5 )
            .attr('text-anchor', 'middle')
            .text('Total Orders')
    }

    const updateBar = () => {
        const svg = select(svgRef.current);
        const group = svg.select('.rect-group')
        const update = group.selectAll('rect').data(data)
        const updatexAxis = svg.select('.x-axis');
        const updateyAxis = svg.select('.y-axis');

        xScale.domain([0, max(data, d => d.orders)])
        yScale.domain(data.map(function(d) { return d.marketplace; }))

        colorScale.domain([0, data.length])

        update.enter()
            .append("rect")
            .attr("x", xScale(0) )
            .attr("y", function(d) { return yScale(d.marketplace); })
            .attr("width", 0)
            .attr("height", yScale.bandwidth() )
            .attr("fill", (d, i) => colorScale(i))

            // .attr("fill", function(d) {
            //     return "rgb("+ Math.round(d.orders * 4) + ",112," + Math.round(d.orders+230 ) + ")";
            // })
            .merge(update)
            .transition().duration(1500)
            .attr("x", xScale(0) )
            .attr("y", function(d) { return yScale(d.marketplace); })
            .attr("width", function(d) { return xScale(d.orders); })
            .attr("height", yScale.bandwidth())
        
        const xAxis = axisBottom(xScale).tickFormat(format('d'));
        if (xScale.domain() [1] < 10) {
            xAxis.ticks(xScale.domain()[1])
        }
        updatexAxis.enter()
            .merge(updatexAxis)
            // .attr("transform", "translate(0," + h + ")")
            .attr("transform",`translate(${margin.left}, ${h + margin.top + 5})`)
            .call(xAxis)

        const yAxis = axisLeft(yScale);
        updateyAxis.enter()
            .merge(updateyAxis)
            .attr("transform", `translate(${margin.left - 5}, ${margin.top})`)
            .call(yAxis)
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
        
        
        updatexAxis.exit()
            .transition().duration(750).remove()

        updateyAxis.exit()
            .transition().duration(750).remove()
        
        update.exit()
            .attr('fill', 'red')
            .transition().duration(750)
            .attr('x',xScale(0))
            .attr('width', 0)
            .remove();
    }

     const newData = () => {
         console.log('change')
        let changedData = data
        changedData.push({marketplace: 'Amazon.uk', orders: 12})
        console.log(changedData)
        setData(changedData)
    }

    useEffect(() => {
        updateBar()
    }, [data])

    useEffect(() => {
        getMarketplaceOrders()
        renderChart()
    },[])

    return (
        <div>
            <p className="data-card-title" style={{marginBottom: '10px'}}>市場地區表現</p>
            <button onClick={() => newData()} className="button">change data</button>

            <div style={{margin: '10px'}}>
                <svg ref={svgRef} width={width} height={height}>
                    <g className="x-axis"/>
                    <g className="y-axis"/>
                </svg>
            </div>
        </div>
    )
}

export default HorizontalBarChart;


// var svg = d3.select("#bar-plot-horizontal")
// .append("svg")
// .attr("width", width + margin.left + margin.right)
// .attr("height", height + margin.top + margin.bottom)
// .append("g")
// .attr("transform",
//     "translate(" + margin.left + "," + margin.top + ")");

//     var x = d3.scaleLinear()
//     .domain()
//     .range([ 0, width]);
// svg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x))
//     .selectAll("text")
//     .attr("transform", "translate(-10,0)rotate(-45)")
//     .style("text-anchor", "end");

// // Y axis
// var y = d3.scaleBand()
//     .range([ 0, height ])
//     .domain(data.map(function(d) { return d.marketplace; }))
//     .padding(.1);
// svg.append("g")
//     .call(d3.axisLeft(y))

// //Bars
// svg.selectAll("myRect")
//     .data(data)
//     .enter()
//     .append("rect")
//     .attr("x", x(0) )
//     .attr("y", function(d) { return y(d.marketplace); })
//     .attr("width", function(d) { return x(d.orders); })
//     // .attr("height", y.bandwidth() )
//     .attr("height", 24)
//     .attr("fill", "#69b3a2")
//     .attr('transform', `translate( 0,${y.bandwidth() / 2 - 12})`)


// Parse the Data
// d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/7_OneCatOneNum_header.csv")
// .then((data) => {
//     // Add X axis
//     var x = d3.scaleLinear()
//         .domain([0, 13000])
//         .range([ 0, width]);
//     svg.append("g")
//         .attr("transform", "translate(0," + height + ")")
//         .call(d3.axisBottom(x))
//         .selectAll("text")
//         .attr("transform", "translate(-10,0)rotate(-45)")
//         .style("text-anchor", "end");

//     // Y axis
//     var y = d3.scaleBand()
//         .range([ 0, height ])
//         .domain(data.map(function(d) { return d.Country; }))
//         .padding(.1);
//     svg.append("g")
//         .call(d3.axisLeft(y))

//     //Bars
//     svg.selectAll("myRect")
//         .data(data)
//         .enter()
//         .append("rect")
//         .attr("x", x(0) )
//         .attr("y", function(d) { return y(d.Country); })
//         .attr("width", function(d) { return x(d.Value); })
//         .attr("height", y.bandwidth() )
//         .attr("fill", "#69b3a2")


// .attr("x", function(d) { return x(d.Country); })
// .attr("y", function(d) { return y(d.Value); })
// .attr("width", x.bandwidth())
// .attr("height", function(d) { return height - y(d.Value); })
// .attr("fill", "#69b3a2")

// })
// }