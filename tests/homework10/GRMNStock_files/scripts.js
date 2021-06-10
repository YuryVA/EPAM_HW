CIQ.Tooltip2=function(e){var t=e.stx,a=e.ohl,i=e.change,s=e.volume,o=e.series,r=e.studies,l=e.showOverBarOnly,n=$(t.chart.container).find("stx-hu-tooltip")[0];function h(){if(this.huTooltip&&CIQ.showTooltip&&!(t.controls.crossX&&"none"==t.controls.crossX.style.display||t.controls.crossY&&"none"==t.controls.crossY.style.display)){var e=this.barFromPixel(this.cx),l=this.chart.dataSegment[e];if(l){if(!CIQ.Marker.Tooltip.sameBar(l,this.huTooltip.lastBar)||e==this.chart.dataSegment.length-1){var n=$(this.huTooltip.node);n.find("[auto]").remove(),n.find("stx-hu-tooltip-field-value").html();var h=this.chart.panel,p=h.yAxis,d={},c=[];if(c.push({member:"DT",display:"DT",panel:h,yAxis:p}),c.push({member:"Close",display:"Close",panel:h,yAxis:p}),d.DT=d.Close=1,i&&CIQ.ChartEngine.isDailyInterval(this.layout.interval)&&c.push({member:"Change",display:"Change",panel:h,yAxis:p}),a&&(c.push({member:"Open",display:"Open",panel:h,yAxis:p}),c.push({member:"High",display:"High",panel:h,yAxis:p}),c.push({member:"Low",display:"Low",panel:h,yAxis:p}),d.Open=d.High=d.Low=1),s&&(c.push({member:"Volume",display:"Volume",panel:null,yAxis:null}),d.Volume=1),o){var m=this.chart.seriesRenderers;for(var u in m){var C=m[u];if(C!==this.mainSeriesRenderer){h=this.panels[C.params.panel],!(p=C.params.yAxis)&&C.params.shareYAxis&&(p=h.yAxis);for(var y=0;y<C.seriesParams.length;y++){var x=C.seriesParams[y],f=x.symbol,g=x.field;f?g&&f!=g&&(f=CIQ.createObjectChainNames(f,g)[0]):f=g;var v=x.display||x.symbol||x.field;f&&!d[v]&&(c.push({member:f,display:v,panel:h,yAxis:p}),d[v]=1)}}}}if(r)for(var T in this.layout.studies){for(var I in p=(h=this.panels[this.layout.studies[T].panel]).yAxis,this.layout.studies[T].outputMap)I&&!d[I]&&(c.push({member:I,display:I,panel:h,yAxis:p}),d[I]=1);d[T+"_hist"]||(c.push({member:T+"_hist",display:T+"_hist",panel:h,yAxis:p}),c.push({member:T+"_hist1",display:T+"_hist1",panel:h,yAxis:p}),c.push({member:T+"_hist2",display:T+"_hist2",panel:h,yAxis:p}),d[T+"_hist"]=1)}for(var A=0;A<c.length;A++){var D=c[A],b=D.member,M=D.display;h=D.panel;var Q=null;(p=D.yAxis)&&(h!==h.chart.panel?p.decimalPlaces||0===p.decimalPlaces?Q=p.decimalPlaces:(p.maxDecimalPlaces||0===p.maxDecimalPlaces)&&(Q=p.maxDecimalPlaces):(Q=Math.max(p.printDecimalPlaces,h.chart.decimalPlaces),(p.maxDecimalPlaces||0===p.maxDecimalPlaces)&&(Q=Math.min(Q,p.maxDecimalPlaces))));var P=null,B=CIQ.existsInObjectChain(l,b);B?P=B.obj[B.member]:"Change"==b&&(P=l.Close-l.iqPrevClose);var w=M.replace(/^(Result )(.*)/,"$2");if(!P&&0!==P||"DT"!=b&&"object"==typeof P&&!P.Close&&0!==P.Close){var L=n.find('stx-hu-tooltip-field[field="'+w+'"]');L.length&&""!==L.find("stx-hu-tooltip-field-name").html()&&L.find("stx-hu-tooltip-field-value").html("n/a")}else{var F="";(P.Close||0===P.Close)&&(P=P.Close),P.constructor==Number?F=p?p.originalPriceFormatter&&p.originalPriceFormatter.func?p.originalPriceFormatter.func(this,h,P,Q):p.priceFormatter&&p.priceFormatter!=CIQ.Comparison.priceFormat?p.priceFormatter(this,h,P,Q):this.formatYAxisPrice(P,h,Q,p):P:P.constructor==Date?"DT"==b&&this.controls.floatDate&&this.controls.floatDate.innerHTML?F=this.chart.xAxis.noDraw?"N/A":this.controls.floatDate.innerHTML:(F=CIQ.yyyymmdd(P),CIQ.ChartEngine.isDailyInterval(this.layout.interval)||(F+=" "+P.toTimeString().substr(0,8))):F=P;var S=n.find('stx-hu-tooltip-field[field="'+w+'"]');if(S.length){S.find("stx-hu-tooltip-field-value").html(F);var k=S.find("stx-hu-tooltip-field-name");""===k.html()&&k.html(this.translateIf(w))}else(w=w.replace("Bollinger Bands ","")).toLowerCase().indexOf("momentum")>-1?w="Momentum":w.toLowerCase().indexOf("ma ")>-1?w="Moving Average (50d)":w.toLowerCase().includes("_hist")||w.toLowerCase().includes("_hist")?w="MACD Histogram":w.toLowerCase().includes("signal ")?w="MACD Signal Line":w.toLowerCase().includes("macd ")?w="MACD":w.toLowerCase().includes("%k")?w="Stochastics %K":w.toLowerCase().includes("%d")?w="Stochastics %D":w.toLowerCase().includes("rsi")?w="RSI":w.includes("Top ")?w="Top Bollinger Bands":w.includes("Median ")?w="Median Bollinger Bands":w.includes("Bottom ")?w="Bottom Bollinger Bands":w.includes("Trend ")?w="Supertrend":w.includes("ATR ")&&(w="Average True Range"),$("<stx-hu-tooltip-field auto></stx-hu-tooltip-field>").append($("<stx-hu-tooltip-field-name>"+this.translateIf(w)+"</stx-hu-tooltip-field-name>")).append($("<stx-hu-tooltip-field-value>"+F+"</stx-hu-tooltip-field-value>")).appendTo(n)}}this.huTooltip.render()}}else this.positionMarkers()}}n||(n=$("<stx-hu-tooltip></stx-hu-tooltip>").appendTo($(t.chart.container))[0]),CIQ.Marker.Tooltip=function(e){this.className||(this.className="CIQ.Marker.Tooltip"),e.label="tooltip",CIQ.Marker.call(this,e)},CIQ.Marker.Tooltip.ciqInheritsFrom(CIQ.Marker,!1),CIQ.Marker.Tooltip.sameBar=function(e,t){return!(!e||!t)&&+e.DT==+t.DT&&e.Close==t.Close&&e.Open==t.Open&&e.Volume==t.Volume},CIQ.Marker.Tooltip.placementFunction=function(e){if(CIQ.showTooltip){for(var t=e.stx,a=0;a<e.arr.length;a++){var i,s,o,r=e.arr[a],n=t.barFromPixel(t.cx),h=t.chart.dataSegment[n],p=!0;if("undefined"!=h&&h&&h.DT&&(i=!0,h.High&&(s=t.pixelFromPrice(h.High)),h.Low&&(o=t.pixelFromPrice(h.Low)),t.highLowBars[t.layout.chartType]||h.Close&&(s=t.pixelFromPrice(h.Close)-15,o=t.pixelFromPrice(h.Close)+15),!l||t.cy>=s&&t.cy<=o||(p=!1)),!(CIQ.ChartEngine.insideChart&&t.layout.crosshair&&t.displayCrosshairs)||t.openDialog||t.activeDrawing||t.grabbingScreen||!i||!p)return r.node.style.left="-50000px",r.node.style.right="auto",void(r.lastBar={});if(CIQ.Marker.Tooltip.sameBar(t.chart.dataSegment[n],r.lastBar)&&n!=t.chart.dataSegment.length-1)return;r.lastBar=t.chart.dataSegment[n];var d=r.lastBar.candleWidth||t.layout.candleWidth;parseInt(getComputedStyle(r.node).width,10)+t.chart.panel.left+30+d<t.backOutX(CIQ.ChartEngine.crosshairX)?(r.node.style.left="auto",r.node.style.right=Math.round(t.container.clientWidth-t.pixelFromBar(n)+30)+"px"):(r.node.style.left=Math.round(t.pixelFromBar(n)+30)+"px",r.node.style.right="auto"),r.node.style.top=Math.round(CIQ.ChartEngine.crosshairY-t.top-parseInt(getComputedStyle(r.node).height,10)/2)+"px"}var c=t.overXAxis,m=t.overYAxis;t.overXAxis=t.overYAxis=!1,t.doDisplayCrosshairs(),t.overXAxis=c,t.overYAxis=m}},CIQ.ChartEngine.prototype.append("undisplayCrosshairs",function(){var e=this.huTooltip;if(e&&e.node){var t=$(e.node);t&&t[0]&&(t[0].style.left="-50000px",t[0].style.right="auto",e.lastBar={})}}),CIQ.ChartEngine.prototype.append("deleteHighlighted",function(){this.huTooltip.lastBar={},this.headsUpHR()}),CIQ.ChartEngine.prototype.append("headsUpHR",h),CIQ.ChartEngine.prototype.append("createDataSegment",h),t.huTooltip=new CIQ.Marker.Tooltip({stx:t,xPositioner:"bar",chartContainer:!0,node:n})};