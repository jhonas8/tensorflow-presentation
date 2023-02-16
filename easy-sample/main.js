const ctx = document.getElementById("myChart");

var xs = [];
var ys = [];
document.getElementById("x").value = 1;

document.getElementById("push").onclick = () => {
  var x = document.getElementById("x").value;
  var y = document.getElementById("y").value;
  xs.push(parseInt(x));
  ys.push(parseInt(y));

  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 128, inputShape: [1] }));
  model.add(
    tf.layers.dense({ units: 128, inputShape: [128], activation: "sigmoid" })
  );
  model.add(tf.layers.dense({ units: 1, inputShape: [128] }));

  const optimizer = tf.train.adam(0.1);

  model.compile({ loss: "meanSquaredError", optimizer });

  document.getElementById("x").value = parseInt(x) + 1;

  model.fit(tf.tensor(xs), tf.tensor(ys), { epochs: 150 }).then(() => {
    const bestfit = model.predict(tf.tensor(xs, [xs.length, 1])).dataSync();

    console.log("xs", xs);

    let chartStatus = Chart.getChart("myChart");
    if (chartStatus) {
      chartStatus.destroy();
    }

    var ctx = document.getElementById("myChart").getContext("2d");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: xs,
        datasets: [
          {
            label: "Original Data",
            data: ys,
            borderWidth: 1,
            borderColor: "#ffffff",
          },
          {
            label: "Best Fit line",
            data: bestfit,
            borderWidth: 1,
            borderColor: "#FF0000",
            backgroundColor: "rgba(1,1,1,0)",
          },
        ],
      },
    });
  });
};

document.getElementById("generate").onclick = () => {
  let x = 0;
  let y = x * x + 2 * x + 1;
  setInterval(() => {
    if (x > 100) return clearInterval();
    xs.push(x++);
    ys.push((y = x * x + 2 * x + 1));

    const model = tf.sequential();
    model.add(tf.layers.dense({ units: 128, inputShape: [1] }));
    model.add(
      tf.layers.dense({ units: 128, inputShape: [128], activation: "sigmoid" })
    );
    model.add(tf.layers.dense({ units: 1, inputShape: [128] }));

    const optimizer = tf.train.adam(0.1);

    model.compile({ loss: "meanSquaredError", optimizer });

    document.getElementById("x").value = parseInt(x);
    document.getElementById("y").value = parseInt(y);

    model.fit(tf.tensor(xs), tf.tensor(ys), { epochs: 150 }).then(() => {
      const bestfit = model.predict(tf.tensor(xs, [xs.length, 1])).dataSync();

      console.log("xs", xs);

      let chartStatus = Chart.getChart("myChart");
      if (chartStatus) {
        chartStatus.destroy();
      }

      var ctx = document.getElementById("myChart").getContext("2d");
      new Chart(ctx, {
        type: "line",
        data: {
          labels: xs,
          datasets: [
            {
              label: "Original Data",
              data: ys,
              borderWidth: 1,
              borderColor: "#ffffff",
            },
            {
              label: "Best Fit line",
              data: bestfit,
              borderWidth: 1,
              borderColor: "#FF0000",
              backgroundColor: "rgba(1,1,1,0)",
            },
          ],
        },
      });
    });
  }, 2500);
};
