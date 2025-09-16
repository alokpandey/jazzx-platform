import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    // CORS headers
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Requested-With, Accept, Origin",
        "Access-Control-Allow-Credentials": "true"
    };

    // Handle preflight requests
    if (req.method === "OPTIONS") {
        context.res = {
            status: 200,
            headers: corsHeaders
        };
        return;
    }

    try {
        context.res = {
            status: 200,
            headers: corsHeaders,
            body: {
                success: true,
                message: "Test endpoint working",
                method: req.method,
                timestamp: new Date().toISOString()
            }
        };
    } catch (error) {
        context.res = {
            status: 500,
            headers: corsHeaders,
            body: {
                success: false,
                error: "Internal server error"
            }
        };
    }
};

export default httpTrigger;
