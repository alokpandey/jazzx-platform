import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
    const path = req.params.path || '';
    const method = req.method;
    
    // CORS headers
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    // Handle preflight requests
    if (method === "OPTIONS") {
        context.res = {
            status: 200,
            headers: corsHeaders
        };
        return;
    }

    try {
        let response;
        
        switch (path) {
            case "login":
                if (method === "POST") {
                    response = await handleLogin(req.body);
                } else {
                    response = { status: 405, body: { error: "Method not allowed" } };
                }
                break;
                
            case "register":
                if (method === "POST") {
                    response = await handleRegister(req.body);
                } else {
                    response = { status: 405, body: { error: "Method not allowed" } };
                }
                break;
                
            case "me":
                if (method === "GET") {
                    response = await handleGetUser(req.headers.authorization);
                } else {
                    response = { status: 405, body: { error: "Method not allowed" } };
                }
                break;
                
            case "logout":
                if (method === "POST") {
                    response = await handleLogout();
                } else {
                    response = { status: 405, body: { error: "Method not allowed" } };
                }
                break;
                
            case "health":
                response = {
                    status: 200,
                    body: {
                        service: "auth-service",
                        status: "healthy",
                        timestamp: new Date().toISOString(),
                        version: "1.0.0"
                    }
                };
                break;
                
            default:
                response = { status: 404, body: { error: "Endpoint not found" } };
        }

        context.res = {
            status: response.status,
            body: response.body,
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json"
            }
        };
        
    } catch (error) {
        context.res = {
            status: 500,
            body: { error: "Internal server error" },
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json"
            }
        };
    }
};

async function handleLogin(body: any) {
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
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
                    token: "mock-jwt-token-" + Date.now(),
                    user: {
                        id: user.userType === "borrower" ? "user-1" : "broker-1",
                        email: user.email,
                        userType: user.userType,
                        name: user.userType === "borrower" ? "Demo User" : "Demo Broker"
                    }
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

async function handleRegister(body: any) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
        status: 200,
        body: {
            success: true,
            data: {
                message: "Registration successful",
                user: {
                    id: "user-" + Date.now(),
                    email: body.email,
                    userType: body.userType || "borrower"
                }
            }
        }
    };
}

async function handleGetUser(authorization: string) {
    if (!authorization) {
        return {
            status: 401,
            body: { error: "Authorization required" }
        };
    }
    
    return {
        status: 200,
        body: {
            success: true,
            data: {
                id: "user-1",
                email: "demo@borrower.com",
                userType: "borrower",
                name: "Demo User"
            }
        }
    };
}

async function handleLogout() {
    return {
        status: 200,
        body: {
            success: true,
            data: { message: "Logged out successfully" }
        }
    };
}

export default httpTrigger;
