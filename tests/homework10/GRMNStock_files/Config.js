var MDSnG;(function(MDSnG){var ClientConfiguration;(function(ClientConfiguration){var Configuration=(function(){function Configuration(){this.configurationObjet={PageSettings:{domain:location.hostname,debuggerAlerts:false,byPass:"WorldDomination",simulate:false,remoteAlerts:false,fadeTime:600,flashTime:500,librairiesPath:"/Content/Scripts/MDSnG/libs/",locale:"en-US",flashColor:"#F7F6C2",animationType:"background",Constants:{Jquery:"$",ProtoBuffer:"dcodeIO",SocketIo:"io"},onServerError:function(){}},AnimationSettings:{positiveChangeColor:"#18bb5c",negativeChangeColor:"#ff433d",animationType:"background",posChangeIndicator:"up",negChangeIndicator:"down",indicatorDivClass:"icon-set",pushValueSpanClass:"push-data",defaultColor:"#000",defaultBackground:"white",maxRows:8,flashColor:"#F7F6C2",useFIFOByAddPointOnChart:false},ConnectionOptions:{serverUri:"mdsngpush.finanzen.net",stream:"protocolbuffers"},FormatterSettings:{NumberFormatter:{localeMatcher:"en-US",options:{precision:2,style:"decimal",minimumFractionDigits:2,maximumFractionDigits:4,useGrouping:true}},PercentFormatter:{localeMatcher:"en-US",options:{precision:2,style:"percent",minimumFractionDigits:2,maximumFractionDigits:4,useGrouping:false}},DateTimeFormatter:{localeMatcher:"en-US",options:{dateFormat:"dd.MM.yyyy",utcToApplicationOffset:-5,useTwelveHourFormat:true,displayDate:false}}},HighStockDetailsChartSettings:{colors:['#B4BE3A','#000099'],chart:{marginRight:10,marginLeft:50,marginBottom:50,width:null},credits:{enabled:false},navigator:{enabled:false},scrollbar:{enabled:false},rangeSelector:{enabled:false},tooltip:{pointFormat:'{point.y}<br/>',valueDecimals:4,borderWidth:1,borderColor:'grey',backgroundColor:'white',shadow:false,crosshairs:[true,true]},legend:{enabled:true,align:'left',layout:'horizontal',verticalAlign:'bottom',y:10},xAxis:{gridLineWidth:1,dateTimeLabelFormats:{day:'%d.%m'}},yAxis:{gridLineWidth:1,startOnTick:true,endOnTick:true,opposite:false,offset:-5},plotOptions:{line:{marker:{symbol:'circle'}}}}}}Configuration.prototype.getConfiguration=function(){return this.configurationObjet};return Configuration}());ClientConfiguration.Configuration=Configuration})(ClientConfiguration=MDSnG.ClientConfiguration||(MDSnG.ClientConfiguration={}))})(MDSnG||(MDSnG={}))