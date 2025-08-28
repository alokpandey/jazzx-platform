import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

export async function loansHandler(request: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
    const path = request.params.path || '';
    const method = request.method;
    
    // CORS headers
    const corsHeaders = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization"
    };

    // Handle preflight requests
    if (method === "OPTIONS") {
        return {
            status: 200,
            headers: corsHeaders
        };
    }

    try {
        let response;
        
        switch (path) {
            case "quote":
                if (method === "POST") {
                    const body = await request.json();
                    response = await handleQuote(body);
                } else {
                    response = { status: 405, body: { error: "Method not allowed" } };
                }
                break;
                
            case "applications":
                if (method === "GET") {
                    response = await handleGetApplications();
                } else if (method === "POST") {
                    const body = await request.json();
                    response = await handleCreateApplication(body);
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

        return {
            status: response.status,
            body: JSON.stringify(response.body),
            headers: {
                ...corsHeaders,
                "Content-Type": "application/json"
            }
        };

    } catch (error) {
        return {
            status: 500,
            body: JSON.stringify({ error: "Internal server error" }),
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

// Register the function
app.http('loans', {
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    authLevel: 'anonymous',
    route: 'loans/{*path}',
    handler: loansHandler
});
