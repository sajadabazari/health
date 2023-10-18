$(document).ready(() => {
    $.ajax({
        url: `${siteUrl}/panel/chart/getChartInfo`,
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        data: {},
        success: (res) => {
            /*chart-donut*/
            let gender = c3.generate({
                bindto: '#chart-donut', // id of chart wrapper
                data: {
                    columns: [
                        // each columns data
                        ['data1', (res.genderCount.man) ? res.genderCount.man : 0],
                        ['data2', (res.genderCount.female) ? res.genderCount.female : 0],
                        ['data3', (res.genderCount.bigender) ? res.genderCount.bigender : 0],
                        ['data4', (res.genderCount.unknown) ? res.genderCount.unknown : 0]
                    ],
                    type: 'donut', // default type of chart
                    colors: {
                        data1: '#6c5ffc',
                        data2: '#05c3fb',
                    },
                    names: {
                        // name of each serie
                        'data1': ` مرد : ${(res.genderCount.man) ? res.genderCount.man : 0}`,
                        'data2': ` زن : ${(res.genderCount.female) ? res.genderCount.female : 0}`,
                        'data3': ` دوجنسیتی : ${(res.genderCount.bigender) ? res.genderCount.bigender : 0}`,
                        'data4': ` نامشخص : ${(res.genderCount.unknown) ? res.genderCount.unknown : 0}`,
                    }
                },
                axis: {},
                legend: {
                    show: false,
                },
                padding: {
                    bottom: 0,
                    top: 0
                },
            });
            let educationRateCount = c3.generate({
                bindto: '#chart-donut2', // id of chart wrapper
                data: {
                    columns: [
                        // each columns data
                        ['data1', (res.educationRateCount.Doctora) ? res.educationRateCount.Doctora : 0],
                        ['data2', (res.educationRateCount.Arshad) ? res.educationRateCount.Arshad : 0],
                        ['data3', (res.educationRateCount.Karshenasi) ? res.educationRateCount.Karshenasi : 0],
                        ['data4', (res.educationRateCount.Kardani) ? res.educationRateCount.Kardani : 0],
                        ['data5', (res.educationRateCount.Diplom) ? res.educationRateCount.Diplom : 0],
                        ['data6', (res.educationRateCount.ZDiplom) ? res.educationRateCount.ZDiplom : 0],
                        ['data7', (res.educationRateCount.Ebtedaei) ? res.educationRateCount.Ebtedaei : 0],
                        ['data8', (res.educationRateCount.Bisavad) ? res.educationRateCount.Bisavad : 0]
                    ],
                    type: 'donut', // default type of chart
                    colors: {
                        'data1': '#6c5ffc',
                        'data2': '#05c3fb',
                        'data3': '#09ad95',
                        'data4': '#1170e4',
                        'data5': '#f82649',
                        'data6': '#f7b731',
                        'data7': '#37b731',
                        'data8': '#e7b731'
                    },
                    names: {
                        // name of each serie
                        'data1': `دکتری : ${(res.educationRateCount.Doctora) ? res.educationRateCount.Doctora : 0}`,
                        'data2': `کارشناسی ارشد : ${(res.educationRateCount.Arshad) ? res.educationRateCount.Arshad : 0}`,
                        'data3': `کارشناسی : ${(res.educationRateCount.Karshenasi) ? res.educationRateCount.Karshenasi : 0}`,
                        'data4': `کاردانی : ${(res.educationRateCount.Kardani) ? res.educationRateCount.Kardani : 0}`,
                        'data5': `دیپلم : ${(res.educationRateCount.Diplom) ? res.educationRateCount.Diplom : 0}`,
                        'data6': `سیکل : ${(res.educationRateCount.ZDiplom) ? res.educationRateCount.ZDiplom : 0}`,
                        'data7': `ابتدایی : ${(res.educationRateCount.Ebtedaei) ? res.educationRateCount.Ebtedaei : 0}`,
                        'data8': `بیسواد : ${(res.educationRateCount.Bisavad) ? res.educationRateCount.Bisavad : 0}`
                    }
                },
                axis: {},
                legend: {
                    show: false, //hide legend
                },
                padding: {
                    bottom: 0,
                    top: 0
                },
            });
            var ctx = document.getElementById("chartPolar");
            var ecoStatusCount = new Chart(ctx, {
                type: 'polarArea',
                data: {
                    datasets: [{
                        data: [
                            (res.ecoStatusCount.weak) ? res.ecoStatusCount.weak : 0,
                            (res.ecoStatusCount.average) ? res.ecoStatusCount.average : 0,
                            (res.ecoStatusCount.good) ? res.ecoStatusCount.good : 0,
                            (res.ecoStatusCount.great) ? res.ecoStatusCount.great : 0
                        ],
                        backgroundColor: ['#f82649', '#1170e4', '#09ad95', '#f7b731'],
                        hoverBackgroundColor: ['#ed0163', '#05c3fb', '#10d772', '#ffeb00'],
                        borderColor: 'transparent',
                    }],
                    labels: ["ضعیف", "متوسط", "خوب", "عالی"]
                },
                options: {
                    scale: {
                        gridLines: {
                            color: 'rgba(119, 119, 142, 0.2)'
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        labels: {
                            fontColor: "#9ba6b5", fontFamily: 'main-font'
                        },
                    }, tooltips: {
                        titleFontFamily: 'main-font',
                        bodyFontFamily: 'main-font',
                        footerFontFamily: 'main-font',
                    }
                }
            });
        },
        error: function (err) {
            console.log(err)
        }
    });
})