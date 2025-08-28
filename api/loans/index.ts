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
            case "quote":
                if (method === "POST") {
                    response = await handleQuote(req.body);
                } else {
                    response = { status: 405, body: { error: "Method not allowed" } };
                }
                break;
                
            case "applications":
                if (method === "GET") {
                    response = await handleGetApplications();
                } else if (method === "POST") {
                    response = await handleCreateApplication(req.body);
                } else {
                    response = { status: 405, body: { error: "Method not allowed" } };
                }
                break;
                
            case "health":
                response = {
                    status: 200,
                    body: {
                        service: "loan-service",
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

async function handleQuote(body: any) {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const { loanAmount, propertyValue, creditScore, annualIncome } = body;
    
    return {
        status: 200,
        body: {
            success: true,
            data: {
                requestId: `quote-${Date.now()}`,
                loanAmount: loanAmount || 500000,
                propertyValue: propertyValue || 600000,
                downPayment: (propertyValue || 600000) * 0.2,
                monthlyPayment: Math.round((loanAmount || 500000) * 0.006),
                interestRate: 6.25,
                apr: 6.31,
                loanTerm: 30,
                estimatedClosingCosts: 8500,
                aiConfidence: 0.94,
                processingTime: "3.2 seconds"
            }
        }
    };
}

async function handleGetApplications() {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return {
        status: 200,
        body: {
            success: true,
            data: [
                {
                    id: "app-1",
                    status: "In Progress",
                    loanAmount: 500000,
                    propertyAddress: "123 Main St, Anytown, CA",
                    submittedDate: "2024-01-15",
                    estimatedCloseDate: "2024-02-15"
                }
            ]
        }
    };
}

async function handleCreateApplication(body: any) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
        status: 201,
        body: {
            success: true,
            data: {
                id: `app-${Date.now()}`,
                status: "Submitted",
                message: "Application created successfully"
            }
        }
    };
}

export default httpTrigger;
