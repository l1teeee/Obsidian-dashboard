const PLAN_ID_MAP: Record<string, string> = {
  starter: import.meta.env.VITE_PAYPAL_PLAN_ID_STARTER as string,
  pro:     import.meta.env.VITE_PAYPAL_PLAN_ID_PRO as string,
  studio:  import.meta.env.VITE_PAYPAL_PLAN_ID_STUDIO as string,
};

export function getPaypalPlanId(planId: string): string {
  const id = PLAN_ID_MAP[planId];
  if (!id) throw new Error(`No PayPal plan ID configured for plan: ${planId}`);
  return id;
}
