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
        if (req.method === "POST") {
            const response = await handleLogin(req.body);
            context.res = {
                status: response.status,
                headers: corsHeaders,
                body: response.body
            };
        } else {
            context.res = {
                status: 405,
                headers: corsHeaders,
                body: { error: "Method not allowed" }
            };
        }
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

async function handleLogin(body: any) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Check if body exists
    if (!body) {
        return {
            status: 400,
            body: {
                success: false,
                error: "Request body is required"
            }
        };
    }
    
    const { email, password } = body;
    
    // Demo credentials
    const validCredentials = [
        { email: "demo@borrower.com", password: "Demo123!", userType: "borrower" },
        { email: "broker@company.com", password: "Broker123!", userType: "broker" }
    ];
    
    const user = validCredentials.find(cred => cred.email === email && cred.password === password);
    
    if (user) {
        return {
            status: 200,
            body: {
                success: true,
                data: {
                    user: {
                        id: user.userType === "borrower" ? "user-1" : "broker-1",
                        email: user.email,
                        userType: user.userType,
                        name: user.userType === "borrower" ? "Demo User" : "Demo Broker"
                    },
                    token: "mock-jwt-token-" + Date.now(),
                    refreshToken: "mock-refresh-token-" + Date.now()
                }
            }
        };
    } else {
        return {
            status: 401,
            body: {
                success: false,
                error: "Invalid credentials"
            }
        };
    }
}

export default httpTrigger;
