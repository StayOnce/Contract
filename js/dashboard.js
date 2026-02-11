function createCountChart(labels, data) {
    new Chart(document.getElementById('countChart'), {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: [
                    '#b6a9c8',
                    '#a09bc3',
                    '#9dbfc3',
                    '#c5c3dd',
                    '#b8d4da',
                    '#8fa3c8'
                ]
            }]
        }
    });
}

function createAmountChart(labels, data) {
    new Chart(document.getElementById('amountChart'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: '合同总金额',
                data: data,
                backgroundColor: '#9dbfc3'
            }]
        },
        options: {
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}
