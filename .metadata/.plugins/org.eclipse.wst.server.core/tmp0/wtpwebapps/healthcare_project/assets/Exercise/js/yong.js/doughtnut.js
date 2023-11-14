
        
        
        let doughtnutChart_1 = $('#doughtnut-chart1');
        let myDoughtnutChart1 = new Chart(doughtnutChart_1, {
            type:'doughnut',
            data:{
                labels:[
                    '스쿼트','데드리프트','벤치프레스'],
                datasets:[
                    {
                        label:'2023년',
                        data:[30,50,20],
                        backgroundColor:["rgba(242,166,54,.5)",
                                         "rgba(206,29,22,.5)",
                                         "rgba(40,161,130,.5)"],
                        borerColor:[ "rgb(242,166,54)",
                                     "rgb(206,29,22)",
                                     "rgb(40,161,130)"],
                        hoverBackgroundColor:[
                                     "rgb(242,166,54)",
                                     "rgb(206,29,22)",
                                     "rgb(40,161,130)"],
                        borderWidth: 1
                    },
    
                ]
            },
            options:{
                maintainAspectRatio :false,
                legend:{
                    display:false
                },
                // indexAxis: 'y', (막대 그래프 세로로 만드는 키)
            }
        });