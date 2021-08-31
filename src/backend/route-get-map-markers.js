const Keyv = require("keyv");
const tasksStorage = new Keyv();
const { v4: uuid } = require("uuid");
const getDataByUrl = require("./get-data-by-url");
const getCenterAmongCoords = require("./get-center-among-coords");
const logger = require("./logger");

module.exports = (app) => {
  app.get("/api/tasks/:id", async function ({ params: { id: taskId } }, res) {
    const response = await tasksStorage.get(taskId);
    logger.debug({ taskId }, "task with id is requested");
    res.json(response);
  });

  app.get("/api/map-markers", function (req, res) {
    const taskId = uuid();
    logger.debug({ taskId }, "task is generated");
    let currentPage;
    let totalPages;

    const onProgress = ({ current, total }) => {
      currentPage = current;
      totalPages = total;

      const storageEntry = {
        page: current,
        totalPages: total,
        isReady: false,
        data: null,
      };

      tasksStorage.set(taskId, storageEntry);
      logger.debug({ taskId, storageEntry }, "task progress is written");
    };

    process.nextTick(async () => {
      const njuskaloDataByUrl = await getDataByUrl(req.query.url, onProgress, {
        taskId,
      });
      logger.debug("data by url is fetched", { njuskaloDataByUrl });

      const centerAmongCoords = getCenterAmongCoords(njuskaloDataByUrl);

      const storageEntry = {
        page: currentPage,
        totalPages: totalPages,
        isReady: true,
        data: {
          njuskaloDataByUrl,
          centerAmongCoords,
        },
      };

      tasksStorage.set(taskId, storageEntry);
      logger.debug({ taskId }, "task is completed");
    });

    res.json({
      taskId,
    });
  });
};
