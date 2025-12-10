import Redis from "ioredis";

const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
	name: process.env.REDIS_APP_NAME || "fogx",
	keyPrefix: (process.env.REDIS_APP_NAME || "fogx") + ":",
});

export default redis;
