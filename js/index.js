$(function () {
    var options = {
        legend: {
            display: false
        }
    };

    $('a.nav-link').on('click', function () {
        $(this).parent().parent().find('a.nav-link.active').removeClass('active');
        $(this).addClass('active');
    });

    $('.update').on('click', update);

    function update() {
        var mode = $('a.nav-link.active').data('mode');
        var lines = $('#history').val().split('\n');
        var jsonData = {};
        // Get data
        console.log('Get data');
        for (var line of lines) {
            try {
                line = line.split(';', 2)[1];
                if (line) {
                    switch (mode) {
                        case 'program':
                        var program = line.split(' ')[0];
                        if (jsonData.hasOwnProperty(program)) {
                            jsonData[program]++;
                        } else {
                            jsonData[program] = 1;
                        }
                        break;

                        case 'command':
                        if (jsonData.hasOwnProperty(line)) {
                            jsonData[line]++;
                        } else {
                            jsonData[line] = 1;
                        }
                        break;
                    }
                }
            } catch (e) {}
        }
        // Convert to array of json objects
        console.log('Convert to array');
        var arrayData = [];
        for (var key in jsonData) {
            if (jsonData.hasOwnProperty(key)) {
                var value = jsonData[key];
                arrayData.push({key: key, value: value});
            }
        }
        // Sort array
        console.log('Sort array');
        var lenghtMultiplier = $('#lenght-multiplier').val();
        arrayData.sort(function (a, b) {
            return b.value - a.value;
        });
        var maxItems = $('#max-items').val();
        if (maxItems) {
            arrayData.length = Math.min(arrayData.length, maxItems);
        }
        console.log('Convert to chart.js data');
        var chartData = {
            labels: [],
            datasets: [
                {
                    data: []
                }
            ]
        };
        // Convert data for chart.js
        for (var json of arrayData) {
            chartData.labels.push(json.key);
            chartData.datasets[0].data.push(json.value);
        }
        console.log('Display chart');
        // Show pie chart
        if (window.chart) window.chart.destroy();
        window.chart = new Chart($('canvas')[0].getContext('2d'), {
            type: 'pie',
            data: chartData,
            options: options
        });
    }
});
