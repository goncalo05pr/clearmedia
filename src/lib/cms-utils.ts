import { createClient } from "./supabase/client";

export async function calculateHomepageStats() {
  const supabase = createClient();
  
  try {
    let satisfactionRate = 98;
    let averageRoi = 320;

    // Calculate satisfaction rate from support messages
    const { data: supportData, error: supportError } = await supabase
      .from('support_messages')
      .select('status');

    if (!supportError && supportData) {
      const totalMessages = supportData.length;
      const completedMessages = supportData.filter((msg: any) => msg.status === 'replied').length;
      satisfactionRate = totalMessages > 0 ? Math.round((completedMessages / totalMessages) * 100) : 98;
    }

    // Calculate average ROI from client data
    const { data: clientData, error: clientError } = await supabase
      .from('clients')
      .select('roi');

    if (!clientError && clientData) {
      const validRois = clientData.filter((client: any) => client.roi && !isNaN(client.roi));
      averageRoi = validRois.length > 0 
        ? Math.round(validRois.reduce((sum: number, client: any) => sum + client.roi, 0) / validRois.length)
        : 320;
    }

    // Get total clients count
    const { count: clientsCount, error: clientsError } = await supabase
      .from('clients')
      .select('*', { count: 'exact', head: true });

    return {
      satisfactionRate,
      averageRoi,
      clientsCount: clientsCount || 247,
      support: "24/7"
    };
  } catch (error) {
    console.error('Error calculating homepage stats:', error);
    return {
      satisfactionRate: 98,
      averageRoi: 320,
      clientsCount: 247,
      support: "24/7"
    };
  }
}

export async function getHomepageContent() {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('cms_content')
      .select('*')
      .eq('id', 'homepage')
      .single();

    if (error) {
      console.error('Error fetching homepage content:', error);
      return null;
    }

    return data.content;
  } catch (error) {
    console.error('Error fetching homepage content:', error);
    return null;
  }
}
