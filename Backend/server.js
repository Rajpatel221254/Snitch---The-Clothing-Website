import app from "./src/app.js";
import { config } from "./src/config/config.js";
import { connectToDB } from "./src/config/database.js";

const PORT = config.PORT || 3000;

connectToDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
