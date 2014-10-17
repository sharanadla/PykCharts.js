PykCharts.oneD.pictograph = function (options) {
    var that = this;
    var theme = new PykCharts.Configuration.Theme({});

    this.execute = function () {
        that = new PykCharts.oneD.processInputs(that, options);
        var optional = options.optional
        ,functionality = theme.oneDimensionalCharts;
        that.showTotal = options.pictograph_showTotal ? options.pictograph_showTotal : functionality.pictograph_showTotal;
        that.enableTotal = options.pictograph_enableTotal ? options.pictograph_enableTotal : functionality.pictograph_enableTotal;
        that.enableCurrent = options.pictograph_enableCurrent ? options.pictograph_enableCurrent : functionality.pictograph_enableCurrent;
        that.imgperline = options.pictograph_imagePerLine ?  options.pictograph_imagePerLine : functionality.pictograph_imagePerLine;
        that.activeText_size = options.pictograph_activeText_size ? options.pictograph_activeText_size : functionality.pictograph_activeText_size;
        that.activeText_color = options.pictograph_activeText_color ? options.pictograph_activeText_color : functionality.pictograph_activeText_color;
        that.activeText_weight = options.pictograph_activeText_weight ? options.pictograph_activeText_weight : functionality.pictograph_activeText_weight;
        that.activeText_family = options.pictograph_activeText_family ? options.pictograph_activeText_family : functionality.pictograph_activeText_family;
        that.inactiveText_size = options.pictograph_inactiveText_size ? options.pictograph_inactiveText_size : functionality.pictograph_inactiveText_size;
        that.inactiveText_color = options.pictograph_inactiveText_color ? options.pictograph_inactiveText_color : functionality.pictograph_inactiveText_color;
        that.inactiveText_weight = options.pictograph_inactiveText_weight ? options.pictograph_inactiveText_weight : functionality.pictograph_inactiveText_weight;
        that.inactiveText_family = options.pictograph_inactiveText_family ? options.pictograph_inactiveText_family : functionality.pictograph_inactiveText_family;
        that.imageWidth =  options.pictograph_imageWidth ? options.pictograph_imageWidth : functionality.pictograph_imageWidth;
        that.imageHeight = options.pictograph_imageHeight ? options.pictograph_imageHeight : functionality.pictograph_imageHeight;
        that.height = options.chart_height ? options.chart_height : that.width;
        if(that.mode === "default") {
           that.k.loading();
        }
        d3.json(options.data, function (e,data) {
            that.data = data.sort(function(a,b) {
                return b.weight - a.weight;
            });
            $(options.selector+" #chart-loader").remove();
            that.render();
        })
    };

    this.render = function () {

        that.transitions = new PykCharts.Configuration.transition(that);
        if(that.mode==="default") {
            that.k.title();
            that.k.subtitle();
        }

        that.optionalFeatures()
                .svgContainer()
                .createChart()
                .labelText()
                .enableLabel();
        if(that.mode==="default") {
            that.k.createFooter()
                .credits()
                .dataSource();
        }

        that.k.export(that,"#svgcontainer","pictograph");

        $(window).on("load", function () { return that.k.resize(that.svgContainer); })
                            .on("resize", function () { return that.k.resize(that.svgContainer); });
    };

    this.optionalFeatures = function () {

        var optional = {
            svgContainer: function () {
                $(options.selector).css("background-color",that.bg);

                that.svgContainer = d3.select(options.selector).append('svg')
                    .attr("width",that.width)
                    .attr("height",that.height)
                    .attr("id","svgcontainer")
                    .attr("preserveAspectRatio", "xMinYMin")
                    .attr("viewBox", "0 0 " + that.width + " " + that.height);

                that.group = that.svgContainer.append("g")
                    .attr("transform", "translate(" + that.imageWidth + ",0)");

                that.group1 = that.svgContainer.append("g")
                    .attr("transform","translate(0,0)");

                return this;
            },
            createChart: function () {
                var a = 0,b=1;

                that.optionalFeatures().showTotal();
                var counter = 0;
                for(var j=1; j<=that.weight; j++) {
                    if(j <= that.data[1].weight ) {
                        that.group.append("image")
                            .attr("xlink:href",that.data[1]["image"])
                            .attr("x", b *(that.imageWidth + 1))
                            .attr("y", a *(that.imageHeight + 10))
                            .attr("width",0)
                            .attr("height", that.imageHeight + "px")
                            .transition()
                            .duration(that.transitions.duration())
                            .attr("width", that.imageWidth + "px");
                    }else {
                        that.group.append("image")
                            .attr("xlink:href",that.data[0]["image"])
                            .attr("x", b *(that.imageWidth + 1))
                            .attr("y", a *(that.imageHeight+ 10))
                            .attr("width",0)
                            .attr("height", that.imageHeight + "px")
                            .transition()
                            .duration(that.transitions.duration())
                            .attr("width", that.imageWidth + "px");
                    }
                    counter++;
                    b++;
                    if (counter >= that.imgperline) {
                        a++;
                        b=1;
                        counter=0;
                        that.group.append("text").html("<br><br>");
                    }
                }
                return this;
            },
            showTotal: function () {
                 if (PykCharts.boolean(that.showTotal)) {
                    that.weight = that.data[0].weight;
                }
                else {
                    that.weight = that.data[1].weight;
                }
                return this ;
            },
            enableLabel: function () {
                if (PykCharts.boolean(that.enableTotal)) {
                    var y_pos =  ((that.data[0].weight)/(that.imgperline));
                    var textHeight;
                     this.labelText();
                     that.group1.append("text")
                        .attr("font-family",that.inactiveText_family)
                        .attr("font-size",that.inactiveText_size)
                        .attr("fill",that.inactiveText_color)
                        .text("/"+that.data[0].weight)
                        .text(function () {
                            textHeight =this.getBBox().height;
                            return "/"+that.data[0].weight;
                        })
                        .attr("x", (that.textWidth+5))
                        .attr("y", function () { return (((that.imageHeight * y_pos)/2)+30); });
                }
                return this;
            },
            labelText: function () {
                if (PykCharts.boolean(that.enableCurrent)) {
                    var y_pos =  ((that.data[0].weight)/(that.imgperline));
                    console.log(y_pos);
                    var textHeight;
                    that.group1.append("text")
                        .attr("x", 0)
                        .attr("font-family",that.activeText_family)
                        .attr("font-size",that.activeText_size)
                        .attr("fill",that.activeText_color)
                        .text(that.data[1].weight)
                        .text(function () {
                            textHeight =this.getBBox().height;
                            that.textWidth = this.getBBox().width;
                            return that.data[1].weight;
                        })
                        .attr("y", function () { return (((that.imageHeight * y_pos)/2)+ 30); });

                }
                return this;
            }
        }
        return optional;
    }
};
