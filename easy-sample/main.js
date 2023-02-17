/* ---------- Constants ---------- */
const ctx = document.getElementById("myChart");

/* ---------- Methods ---------- */
const generateChart = (options) => {
  let chartStatus = Chart.getChart("myChart");

  if (chartStatus) {
    chartStatus.destroy();
  }

  const ctx = document.getElementById("myChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: "line",
    data: options,
  });

  return chart;
};

const initiateApplication = () => {
  document.getElementById("x").value = 1;
};

const generateBestFitLine = async ({ xs, ys }) => {
  const model = tf.sequential();
  let bestfit = [];

  // Add layers to the model (input layer, hidden layer, output layer)
  model.add(tf.layers.dense({ units: 128, inputShape: [1] }));
  model.add(
    tf.layers.dense({ units: 128, inputShape: [128], activation: "sigmoid" })
  );
  model.add(tf.layers.dense({ units: 1, inputShape: [128] }));

  // optimizer is used to minimize the loss function
  const optimizer = tf.train.adam(0.1);

  model.compile({ loss: "meanSquaredError", optimizer });

  // train the model
  const trainedModal = await model.fit(tf.tensor(xs), tf.tensor(ys), {
    epochs: 150,
  });

  bestfit = model.predict(tf.tensor(xs, [xs.length, 1])).dataSync();

  return bestfit;
};

const getOnClickPushHandler = () => {
  let xs = [],
    ys = [];

  return () => {
    let x = document.getElementById("x").value;
    let y = document.getElementById("y").value;

    xs.push(parseInt(x));
    ys.push(parseInt(y));

    document.getElementById("x").value = parseInt(x) + 1;

    generateBestFitLine({ xs, ys }).then((bestfit) => {
      generateChart({
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
      });
    });
  };
};

/* ---------- Application ---------- */
document.getElementById("push").onclick = getOnClickPushHandler();

document.getElementById("generate").onclick = () => {
  const xs = [],
    ys = [];

  // y = x^2 + 2x + 1
  let x = 0;
  let y = x * x + 2 * x + 1;
  setInterval(() => {
    if (x > 30) return clearInterval();
    xs.push(x++);
    ys.push((y = x * x + 2 * x + 1));

    generateBestFitLine({ xs, ys }).then((bestfit) => {
      // updates the value of x and y in the input fields
      document.getElementById("x").value = parseInt(x);
      document.getElementById("y").value = parseInt(y);

      generateChart({
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
      });
    });
  }, 2500);
};
