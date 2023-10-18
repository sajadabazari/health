$(function () {
    "use strict";

    /*chart-donut*/
    var chart = c3.generate({
        bindto: '#chart-donut', // id of chart wrapper
        data: {
            columns: [
                // each columns data
                ['data1', 23],
                ['data2', 45]
            ],
            type: 'donut', // default type of chart
            colors: {
                data1: '#6c5ffc',
                data2: '#05c3fb',
            },
            names: {
                // name of each serie
                'data1': 'sss',
                'data2': 'ssss',
            }
        },
        axis: {

        },
        legend: {
            show: false,
            inset: {
                anchor: 'top-right',
                x: 20,
                y: 10,
                step: 20
              }
        },
        padding: {
            bottom: 0,
            top: 0
        },
    });

    /*chart-donut*/
    var chart = c3.generate({
        bindto: '#chart-donut2', // id of chart wrapper
        data: {
            columns: [
                // each columns data
                ['data1', 78],
                ['data2', 95],
                ['data3', 25],
                ['data4', 45],
                ['data5', 75],
                ['data6', 25],
            ],
            type: 'donut', // default type of chart
            colors: {
                'data1': '#6c5ffc',
                'data2': '#05c3fb',
                'data3': '#09ad95',
                'data4': '#1170e4',
                'data5': '#f82649',
                'data6': '#f7b731',
            },
            names: {
                // name of each serie
                'data1': 'فروش 1',
                'data2': 'فروش 2',
                'data3': 'فروش 3',
                'data4': 'فروش 4',
                'data5': 'فروش 5',
                'data6': 'فروش 6',
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
    /* Pie Chart*/
    var datapie = {
        labels: ['مرد', 'زن'],
        datasets: [{
            data: [20, 30],
            backgroundColor: ['#6c5ffc', '#05c3fb']
        }]
    };
    var optionpie = {
        maintainAspectRatio: false,
        responsive: true,
        legend: {
            display: false, fontFamily: 'main-font'
        },
        animation: {
            animateScale: true,
            animateRotate: true
        }, tooltips: {
            titleFontFamily: 'main-font',
            bodyFontFamily: 'main-font',
            footerFontFamily: 'main-font',
        }
    };

    /* Doughbut Chart*/
    var ctx6 = document.getElementById('chartPie');
    var myPieChart6 = new Chart(ctx6, {
        type: 'doughnut',
        data: datapie,
        options: optionpie
    });

    /* Pie Chart*/
    var ctx7 = document.getElementById('chartDonut');
    var myPieChart7 = new Chart(ctx7, {
        type: 'pie',
        data: datapie,
        options: optionpie
    });

    /* Radar chart*/
    var ctx = document.getElementById("chartRadar");
    var myChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: [

                ["خوردن", "شام"],
                ["نوشیدن", "ب"], "خواب", ["طراحی", "گرافیک"], "کدنویسی", "دوچرخه", "دویدن",

            ],
            datasets: [{

                label: "دیتای 1",
                data: [65, 59, 66, 45, 56, 55, 40],
                borderColor: "rgba(108, 95, 252, .8)",
                borderWidth: "1",
                backgroundColor: "rgba(108, 95, 252, .4)", fontFamily: 'main-font'
            }, {
                label: "دیتای 2",
                data: [28, 12, 40, 19, 63, 27, 87],
                borderColor: "rgba(5, 195, 251,0.8)",
                borderWidth: "1",
                backgroundColor: "rgba(5, 195, 251,0.4)", fontFamily: 'main-font'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            scale: {
                angleLines: { color: '#9ba6b5' },
                gridLines: {
                    color: 'rgba(119, 119, 142, 0.2)'
                },
                ticks: {
                    beginAtZero: true,
                },
                pointLabels: {
                    fontColor: '#9ba6b5', fontFamily: 'main-font'
                },
            },
            tooltips: {
                titleFontFamily: 'main-font',
                bodyFontFamily: 'main-font',
                footerFontFamily: 'main-font',
            }
        }
    });

    /* polar chart */
    var ctx = document.getElementById("chartPolar");
    var myChart = new Chart(ctx, {
        type: 'polarArea',
        data: {
            datasets: [{
                data: [18, 15, 9, 6, 19],
                backgroundColor: ['#6c5ffc', '#05c3fb', '#09ad95', '#1170e4', '#e82646'],
                hoverBackgroundColor: ['#6c5ffc', '#05c3fb', '#09ad95', '#1170e4', '#e82646'],
                borderColor: 'transparent',
            }],
            labels: ["دیتا1", "دیتا2", "دیتا3", "دیتا4"]
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

});