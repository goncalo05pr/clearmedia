import { createClient } from "./supabase/client";

export async function calculateHomepageStats() {
  const supabase = createClient();
  
  try {
    let formationsSold = 0;
    let satisfactionRate = 98;

    // Calculer le nombre de formations vendues
    const { count: salesCount, error: salesError } = await supabase
      .from('user_purchases')
      .select('*', { count: 'exact', head: true });

    if (!salesError && salesCount !== null) {
      formationsSold = salesCount;
    }

    // Calculer le taux de satisfaction depuis les avis
    const { data: reviewsData, error: reviewsError } = await supabase
      .from('reviews')
      .select('rating');

    if (!reviewsError && reviewsData && reviewsData.length > 0) {
      const totalReviews = reviewsData.length;
      const positiveReviews = reviewsData.filter(review => review.rating >= 4).length;
      satisfactionRate = Math.round((positiveReviews / totalReviews) * 100);
    }

    // Récupérer le nombre total de clients
    const { count: clientsCount, error: clientsError } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    return {
      formationsSold,
      satisfactionRate,
      averageRoi: 320,
      clientsCount: clientsCount || 247,
      support: "24/7"
    };
  } catch (error) {
    console.error('Error calculating homepage stats:', error);
    return {
      formationsSold: 0,
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

export async function getReviewsForHomepage() {
  const supabase = createClient();
  
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching reviews:', error);
      return [];
    }

    // Get user and formation info separately
    const reviewsWithDetails = await Promise.all(
      (data || []).map(async (review) => {
        const [{ data: userData }, { data: formationData }] = await Promise.all([
          supabase.from('auth.users').select('email').eq('id', review.user_id).single(),
          supabase.from('formations').select('title').eq('id', review.formation_id).single()
        ]);

        return {
          ...review,
          user: userData ? { email: userData.email } : { email: 'Anonymous' },
          formation: formationData ? { title: formationData.title } : { title: 'Formation' }
        };
      })
    );

    return reviewsWithDetails;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}
