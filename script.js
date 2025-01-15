d3.json(
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json"
)
  .then((data) => {
    const width = 800;
    const height = 400;
    const legendWidth = 150;
    const legendHeight = 100;
    const padding = 50;

    const legendData = [
      { label: "No doping allegations", color: "blue" },
      { label: "Riders with doping allegations", color: "red" },
    ];
    const svg = d3
      .select("#container")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const tooltip = d3
      .select("body")
      .append("div")
      .attr("id", "tooltip")
      .style("position", "absolute")
      .style("background-color", "white")
      .style("border", "1px solid gray")
      .style("border-radius", "4px")
      .style("padding", "5px")
      .style("font-size", "12px")
      .style("box-shadow", "0px 2px 5px rgba(0, 0, 0, 0.3)")
      .style("display", "none")
      .style("pointer-events", "none");
    const tooltipselector = d3.select("#tooltip");

    const legend = svg
      .append("g")
      .attr("id", "legend")
      .attr(
        "transform",
        `translate(${width - legendWidth - padding}, ${padding})`
      );
    legend
      .selectAll("g")
      .data(legendData)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (d, i) => `translate(0, ${i * 20})`) // Atur jarak antar item
      .each(function (d) {
        const g = d3.select(this);

        // Tambahkan simbol (kotak kecil atau lingkaran)
        g.append("rect")
          .attr("x", 0)
          .attr("y", 0)
          .attr("width", 15)
          .attr("height", 15)
          .attr("fill", d.color);

        // Tambahkan label teks
        g.append("text")
          .attr("x", 20) // Posisi teks sedikit ke kanan dari kotak
          .attr("y", 12) // Vertikal di tengah kotak
          .text(d.label)
          .attr("font-size", "12px")
          .attr("fill", "black");
      });

    const years = data.map((d) => d.Year);
    console.log(years);

    const minYear = d3.min(years) - 1;
    const maxYear = d3.max(years) + 1;
    console.log(`min: ${minYear} & max: ${maxYear}`);

    const xScale = d3
      .scaleLinear()
      .domain([minYear, maxYear])
      .range([padding, width - padding]);

    const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d"));

    svg
      .append("g")
      .attr("id", "x-axis")
      .attr("transform", `translate(0, ${height - padding})`)
      .call(xAxis);

    const timeInSec = data.map(
      (d) =>
        parseInt(d.Time.split(":")[0]) * 60 + parseInt(d.Time.split(":")[1])
    );

    console.log(timeInSec);

    const minTime = d3.min(timeInSec);
    const maxTime = d3.max(timeInSec);
    console.log(`min: ${minTime} & max: ${maxTime}`);

    const yScale = d3
      .scaleLinear()
      .domain([minTime, maxTime])
      .range([padding, height - padding]);

    const yAxisTickValue = [
      2220, 2235, 2250, 2265, 2280, 2295, 2310, 2325, 2340, 2355, 2370, 2385,
    ];
    const yAxis = d3
      .axisLeft(yScale)
      .tickValues(yAxisTickValue)
      .tickFormat((d) => {
        const minutes = Math.floor(d / 60);
        const seconds = d % 60;
        return `${d3.format("02d")(minutes)}:${d3.format("02d")(seconds)}`;
      });

    svg
      .append("g")
      .attr("id", "y-axis")
      .attr("transform", `translate(${padding}, 0)`) // Position the Y-axis correctly
      .call(yAxis);

    svg
      .selectAll("circle")
      .data(data)
      .enter()
      .append("circle")
      .attr("class", "dot")
      .attr("data-xvalue", (d) => d.Year)
      .attr("data-yvalue", (d) => {
        const [minutes, seconds] = d.Time.split(":").map(Number);
        const date = new Date(1970, 0, 1, 0, minutes, seconds); // Create Date object
        return date;
      })
      .attr("cx", (d) => xScale(d.Year))
      .attr("cy", (d, i) => yScale(timeInSec[i]))
      .attr("r", 5)
      .attr("fill", (d) => (d.Doping === "" ? "blue" : "red"))
      .on("mouseover", function (e, d) {
        tooltipselector
          .style("display", "block")
          .attr("data-year", d.Year)
          .text(`Year: ${d.Year}`);
      })
      .on("mousemove", function (e) {
        tooltipselector
          .style("left", `${e.pageX + 10}px`)
          .style("top", `${e.pageY + 10}px`);
      })
      .on("mouseout", function () {
        tooltipselector.style("display", "none");
      });
  })
  .catch((error) => {
    console.error("Error loading data: ", error);
  });
