const app = require("express")();
const PORT = process.env.PORT || 3001;

app.get("/", (_, res) => res.sendStatus(200));

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
