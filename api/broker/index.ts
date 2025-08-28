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
            case "clients":
                if (method === "GET") {
                    response = await handleGetClients();
                } else if (method === "POST") {
                    response = await handleCreateClient(req.body);
                } else {
                    response = { status: 405, body: { error: "Method not allowed" } };
                }
                break;
                
            case "pipeline":
                if (method === "GET") {
                    response = await handleGetPipeline();
                } else {
                    response = { status: 405, body: { error: "Method not allowed" } };
                }
                break;
                
            case "applications":
                if (method === "GET") {
                    response = await handleGetBrokerApplications();
                } else {
                    response = { status: 405, body: { error: "Method not allowed" } };
                }
                break;
                
            case "health":
                response = {
                    status: 200,
                    body: {
                        service: "broker-service",
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

async function handleGetClients() {
    await new Promise(resolve => setTimeout(resolve, 1200));
    
    return {
        status: 200,
        body: {
            success: true,
            data: [
                {
                    id: "client-1",
                    name: "John Smith",
                    email: "john.smith@email.com",
                    phone: "(555) 123-4567",
                    loanAmount: 450000,
                    status: "Pre-approved",
                    lastContact: "2024-01-20"
                },
                {
                    id: "client-2",
                    name: "Sarah Johnson",
                    email: "sarah.j@email.com",
                    phone: "(555) 987-6543",
                    loanAmount: 320000,
                    status: "In Review",
                    lastContact: "2024-01-18"
                }
            ]
        }
    };
}

async function handleCreateClient(body: any) {
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    return {
        status: 201,
        body: {
            success: true,
            data: {
                id: `client-${Date.now()}`,
                ...body,
                status: "New Lead",
                createdDate: new Date().toISOString()
            }
        }
    };
}

async function handleGetPipeline() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
        status: 200,
        body: {
            success: true,
            data: {
                totalValue: 2450000,
                activeDeals: 8,
                closingThisMonth: 3,
                pipeline: [
                    { stage: "Leads", count: 12, value: 3200000 },
                    { stage: "Pre-approved", count: 8, value: 2450000 },
                    { stage: "Processing", count: 5, value: 1800000 },
                    { stage: "Underwriting", count: 3, value: 950000 },
                    { stage: "Closing", count: 2, value: 650000 }
                ]
            }
        }
    };
}

async function handleGetBrokerApplications() {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    return {
        status: 200,
        body: {
            success: true,
            data: [
                {
                    id: "app-br-1",
                    clientName: "John Smith",
                    loanAmount: 450000,
                    propertyAddress: "123 Oak Street, Austin, TX",
                    status: "Pre-approved",
                    submittedDate: "2024-01-15",
                    estimatedCloseDate: "2024-02-20"
                },
                {
                    id: "app-br-2",
                    clientName: "Sarah Johnson",
                    loanAmount: 320000,
                    propertyAddress: "456 Pine Avenue, Dallas, TX",
                    status: "In Review",
                    submittedDate: "2024-01-18",
                    estimatedCloseDate: "2024-02-25"
                }
            ]
        }
    };
}

export default httpTrigger;
