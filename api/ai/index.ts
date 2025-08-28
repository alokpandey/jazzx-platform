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
            case "insights":
                if (method === "POST") {
                    response = await handleGetInsights(req.body);
                } else {
                    response = { status: 405, body: { error: "Method not allowed" } };
                }
                break;
                
            case "recommendations":
                if (method === "POST") {
                    response = await handleGetRecommendations(req.body);
                } else {
                    response = { status: 405, body: { error: "Method not allowed" } };
                }
                break;
                
            case "risk-analysis":
                if (method === "POST") {
                    response = await handleRiskAnalysis(req.body);
                } else {
                    response = { status: 405, body: { error: "Method not allowed" } };
                }
                break;
                
            case "health":
                response = {
                    status: 200,
                    body: {
                        service: "ai-service",
                        status: "healthy",
                        timestamp: new Date().toISOString(),
                        version: "1.0.0",
                        aiModels: ["GPT-4", "Risk Assessment", "Loan Matching"]
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

async function handleGetInsights(body: any) {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    const { loanAmount, creditScore, income } = body;
    
    return {
        status: 200,
        body: {
            success: true,
            data: {
                insights: [
                    {
                        type: "opportunity",
                        title: "Rate Optimization",
                        description: "Based on current market conditions, you could save $180/month with a different loan program.",
                        confidence: 0.92
                    },
                    {
                        type: "risk",
                        title: "DTI Analysis",
                        description: "Debt-to-income ratio is optimal at 28%. Consider this for future applications.",
                        confidence: 0.88
                    },
                    {
                        type: "recommendation",
                        title: "Loan Program Match",
                        description: "Conventional 30-year fixed is the best match for this profile.",
                        confidence: 0.95
                    }
                ],
                processingTime: "2.5 seconds",
                aiConfidence: 0.91
            }
        }
    };
}

async function handleGetRecommendations(body: any) {
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return {
        status: 200,
        body: {
            success: true,
            data: {
                recommendations: [
                    {
                        id: "rec-1",
                        type: "loan-program",
                        title: "Switch to 15-Year Fixed",
                        description: "Save $89,000 in interest over loan term",
                        impact: "high",
                        savings: 89000
                    },
                    {
                        id: "rec-2",
                        type: "down-payment",
                        title: "Increase Down Payment",
                        description: "Avoid PMI with 20% down payment",
                        impact: "medium",
                        savings: 12000
                    }
                ],
                totalPotentialSavings: 101000,
                aiConfidence: 0.89
            }
        }
    };
}

async function handleRiskAnalysis(body: any) {
    await new Promise(resolve => setTimeout(resolve, 1800));
    
    return {
        status: 200,
        body: {
            success: true,
            data: {
                riskScore: 0.23,
                riskLevel: "Low",
                factors: [
                    { name: "Credit Score", impact: "positive", weight: 0.35 },
                    { name: "Debt-to-Income", impact: "positive", weight: 0.28 },
                    { name: "Employment History", impact: "positive", weight: 0.22 },
                    { name: "Down Payment", impact: "neutral", weight: 0.15 }
                ],
                recommendations: [
                    "Excellent credit profile for prime lending",
                    "Consider jumbo loan programs for higher amounts"
                ],
                aiConfidence: 0.94
            }
        }
    };
}

export default httpTrigger;
