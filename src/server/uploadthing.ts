/** server/uploadthing.ts */
import { createUploadthing, type FileRouter } from "uploadthing/next-legacy";
const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	// Define as many FileRoutes as you like, each with a unique routeSlug
	userImage: f
		// Set permissions and file types for this FileRoute
		.fileTypes(["image"])
		.maxSize("8MB")
		.middleware(async (req, res) => {

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return {  };
		})
		.onUploadComplete(async ({ metadata, file }) => {
			// This code RUNS ON YOUR SERVER after upload
			console.log("Upload complete for userId:");

			console.log("file url", file.url);
		}),
} as FileRouter;

export type OurFileRouter = typeof ourFileRouter;