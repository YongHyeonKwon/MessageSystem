        
        
          src="./code.jquery.com_jquery-3.7.1.min.js"
         src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"
        
        let barChart1 = $('#bar-chart1');
        let myBarChart1 = new Chart(barChart1, {
            type:'bar',
            data:{
                labels:[
                    '1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'
                ],
                datasets:[
                    {
                        label:'2023년',
                        data:[10,8,6,5,12,7,16,7,6,10,12,10],
                        backgroundColor:["rgba(242,166,54,.5)",
                                         "rgba(39,79,76,.5)",
                                         "rgba(40,161,130,.5)",
                                         "rgba(206,29,22,.5)",
                                         "rgba(242,166,54,.5)",
                                         "rgba(39,79,76,.5)",
                                         "rgba(40,161,130,.5)",
                                         "rgba(206,29,22,.5)",
                                         "rgba(242,166,54,.5)",
                                         "rgba(39,79,76,.5)",
                                         "rgba(40,161,130,.5)",
                                         "rgba(206,29,22,.5)"],
                        borerColor:[ "rgb(242,166,54)",
                                     "rgb(39,79,76)",
                                     "rgb(40,161,130)",
                                     "rgb(206,29,22)",
                                     "rgb(242,166,54)",
                                     "rgb(39,79,76)",
                                     "rgb(40,161,130)",
                                     "rgb(206,29,22)",
                                     "rgb(242,166,54)",
                                     "rgb(39,79,76)",
                                     "rgb(40,161,130)",
                                     "rgb(206,29,22)"],
                        hoverBackgroundColor:[
                                     "rgb(242,166,54)",
                                     "rgb(39,79,76)",
                                     "rgb(40,161,130)",
                                     "rgb(206,29,22)",
                                     "rgb(242,166,54)",
                                     "rgb(39,79,76)",
                                     "rgb(40,161,130)",
                                     "rgb(206,29,22)",
                                     "rgb(242,166,54)",
                                     "rgb(39,79,76)",
                                     "rgb(40,161,130)",
                                     "rgb(206,29,22)"
                        ],
                        borderWidth: 1
                    },
    
                ]
            },
            options:{
                maintainAspectRatio :false,
                legend:{
                    display:false
                }
                // indexAxis: 'y', (막대 그래프 세로로 만드는 키)
            }
        });