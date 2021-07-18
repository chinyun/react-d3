import React, {useState, useEffect, useRef} from 'react';
import Select from 'react-select';
import { scaleLinear, scaleBand, select, axisBottom, axisLeft, max, } from 'd3';

const deData = [
    {marketplace: "Amazon.de", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-1A1", totalOrder: 4},
    {marketplace: "Amazon.de", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-2A1", totalOrder: 3},
    {marketplace: "Amazon.de", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-3A3", totalOrder: 2},
    {marketplace: "Amazon.de", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-4A2", totalOrder: 1},
    {marketplace: "Amazon.de", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-6A1", totalOrder: 1},
    {marketplace: "Amazon.de", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-7A2", totalOrder: 1},
    {marketplace: "Amazon.de", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-8A1", totalOrder: 1},
    {marketplace: "Amazon.de", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-9A2", totalOrder: 3},
    {marketplace: "Amazon.de", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-AA1", totalOrder: 1},
    {marketplace: "Amazon.de", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-AA3", totalOrder: 1},
]

const usData = [
    {marketplace: "Amazon.com", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-1A1", totalOrder: 29},
    {marketplace: "Amazon.com", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-2A1", totalOrder: 30},
    {marketplace: "Amazon.com", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-6A1", totalOrder: 4},
    {marketplace: "Amazon.com", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-7A2", totalOrder: 5},
    {marketplace: "Amazon.com", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-8A1", totalOrder: 7},
    {marketplace: "Amazon.com", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-9A2", totalOrder: 10},
    {marketplace: "Amazon.com", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-AA1", totalOrder: 12},
    {marketplace: "Amazon.com", bpCode: "BP-K612-8BSMAP0118D0700", sku: "K612-AA3", totalOrder: 3},
]


const BarChart = () => {
    const [data, setData] = useState(usData)
    const svgRef = useRef();

    const [mp, setMp] = useState('Amazon.com')
    const [mpOp, setMpOp] = useState([
        {value: 'Amazon.com', label: 'Amazon.com'},
        {value: 'Amazon.de', label: 'Amazon.de'}
    ])

    const onSelectMp = (e) => {
        setMp(e.value)
        if (e.value == 'Amazon.com') {
            setData(usData)
        } else {
            setData(deData)
        }
    }
    const margin = {left: 50, right: 10, top: 30, bottom: 60}
    const w = 690 - margin.left -margin.right;
    const h = 310 - margin.top - margin.bottom;

    let xScale = scaleBand()
        .domain(data.map(function(d) { return d.sku; }))
        .rangeRound([0, w])
        .paddingInner(0.05);
    
    let yScale = scaleLinear()
        .domain([0, max(data, d => d.totalOrder)])
        .range([h,0]);

    // const colorScale = scaleLinear()
    //     .domain(data.map(function(d) { return d.sku; }))
    //     .range(["green", "red"]);
    
    const renderChart = () => {
        const svg = select(svgRef.current);
        const group = svg.append('g')
            .attr("class", 'rect-group')
            .attr('transform', `translate(${margin.left},${margin.top} )`)

        group.selectAll("rect")
            .data(data)
            .enter()
            .append("rect")
            .attr("x", function(d, i) {
              return xScale(d.sku);
            })
            .attr("y", function(d) {
              return yScale(d.totalOrder);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {
              return h - yScale(d.totalOrder);
            })
            .attr("fill", function(d) {
              return "rgb("+ Math.round(d.totalOrder * 4) + ",112," + Math.round(d.totalOrder+230 ) + ")";
            });
            // .attr("fill", d=>colorScale(d.sku))
        
            const xAxis = axisBottom(xScale);
            svg.select(".x-axis")
                .attr("transform",`translate(${margin.left}, ${h + margin.top + 5})`)
                .call(xAxis)
                .selectAll("text")
                .attr("transform", "translate(-10,0)rotate(-45)")
                .style("text-anchor", "end");
                
            const yAxis = axisLeft(yScale);
            svg.select('.y-axis')
                .attr("transform", `translate(${margin.left - 5}, ${margin.top})`)
                .call(yAxis);
    }

    const updateBar = () => {
        const svg = select(svgRef.current);
        const group = svg.select('.rect-group')
        const update = group.selectAll('rect').data(data)
        const updatexAxis = svg.select('.x-axis');
        const updateyAxis = svg.select('.y-axis');

        xScale.domain(data.map(function(d) { return d.sku; }))
        yScale.domain([0, max(data, d => d.totalOrder)]) 

        update.enter()
            .append('rect')
            .attr('x', (d) => { return xScale(d.sku); })
            .attr('y', yScale(0))
            .attr('width', xScale.bandwidth())
            .attr('height', 0)
            // .attr('fill', '#005540')
            .attr("fill", function(d) {
                return "rgb("+ Math.round(d.totalOrder * 4) + ",112," + Math.round(d.totalOrder+230) + ")";
            })
            .merge(update)
            .transition().duration(1500)
            .attr("x", function(d, i) { 
                return xScale(d.sku);
              })
            .attr("y", function(d) {
                return yScale(d.totalOrder);
            })
            .attr("width", xScale.bandwidth())
            .attr("height", function(d) {
                return h - yScale(d.totalOrder);
            })
        
        const xAxis = axisBottom(xScale);
        updatexAxis.enter()
            .merge(updatexAxis)
            .attr("transform",`translate(${margin.left}, ${h + margin.top + 5})`)
            .call(xAxis)
            .selectAll("text")
            .attr("transform", "translate(-10,0)rotate(-45)")
            .style("text-anchor", "end");
        
        const yAxis = axisLeft(yScale);
        updateyAxis.enter()
            .merge(updateyAxis)
            .attr("transform", `translate(${margin.left - 5}, ${margin.top})`)
            .call(yAxis);
    
        updatexAxis.exit()
            .transition().duration(750).remove()

        updateyAxis.exit()
            .transition().duration(750).remove()
        
        update.exit()
            .attr('fill', 'red')
            .transition().duration(750)
            .attr('y',yScale(0))
            .attr('height', 0)
            .remove();
    }

    // const newData = () => {
    //     // let changedData = data
    //     // changedData = changedData.map((d,i) => Math.floor(Math.random() * 20) + 5)
    //     // setData(changedData)
    // }

    useEffect(() => {
        updateBar()
    },[data])

    useEffect(() => {
        renderChart()
    }, [])

    return (
        <div style={{padding: '15%'}}>
            <p className="data-card-title">SKU表現</p>
            <Select
                className='drs-selector'
                placeholder={mp}
                options={mpOp}
                value={mp}
                onChange={(e) => onSelectMp(e)}
            />
            {/* <button onClick={() => newData()} className="button">change data</button> */}
            <div style={{margin: '5%'}}>
                <svg ref={svgRef} width="690" height="310">
                    <g className="x-axis"/>
                    <g className="y-axis"/>
                </svg>  
            </div>
            
        </div>
    )
}

export default BarChart
