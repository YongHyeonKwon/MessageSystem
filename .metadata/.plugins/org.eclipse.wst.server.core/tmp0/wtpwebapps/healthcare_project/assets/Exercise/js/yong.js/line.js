       
       
       src="./code.jquery.com_jquery-3.7.1.min.js"
        src="https://cdn.jsdelivr.net/npm/chart.js@3.7.1/dist/chart.min.js"

 
        let lineChart1 = $('#line-chart1');
        let myLineChart1 = new Chart(lineChart1, {
            type:'line',
            data:{
                labels:[
                    '1월','2월','3월','4월','5월','6월','7월','8월','9월','10월','11월','12월'
                ],
                datasets:[
                    {
                        label:'2023년',
                        data:[10,8,6,5,12,7,16,7,6,10,12,10],
                        backgroundColor:'rgba(40,161,130,.5)',
                        borerColor:'rgba(40,161,130,.5)'
                        
                    }
    
                ]
            },
            options:{
                maintainAspectRatio :false
            }
        });
  