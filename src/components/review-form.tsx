"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Review } from "@/lib/review-types";

interface ReviewFormProps {
  formationId: string;
  formationTitle: string;
  onReviewSubmitted?: () => void;
}

export default function ReviewForm({ formationId, formationTitle, onReviewSubmitted }: ReviewFormProps) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [existingReview, setExistingReview] = useState<Review | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    checkExistingReview();
  }, [formationId]);

  const checkExistingReview = async () => {
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('formation_id', formationId)
        .eq('user_id', user.id)
        .single();

      if (!error && data) {
        setExistingReview(data as Review);
        setRating(data.rating);
        setComment(data.comment || "");
      }
    } catch (error) {
      console.error('Error checking existing review:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        alert('Vous devez être connecté pour laisser un avis');
        return;
      }

      if (existingReview) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({
            rating,
            comment,
            updated_at: new Date().toISOString()
          })
          .eq('id', existingReview.id);

        if (error) {
          console.error('Error updating review:', error);
          alert('Erreur lors de la mise à jour de votre avis');
        } else {
          alert('Votre avis a été mis à jour avec succès !');
          if (onReviewSubmitted) onReviewSubmitted();
        }
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert({
            formation_id: formationId,
            user_id: user.id,
            rating,
            comment,
            is_public: true,
            created_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error creating review:', error);
          alert('Erreur lors de la création de votre avis');
        } else {
          alert('Votre avis a été ajouté avec succès !');
          if (onReviewSubmitted) onReviewSubmitted();
          checkExistingReview(); // Refresh existing review
        }
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Erreur lors de la soumission de votre avis');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStars = (value: number, onChange: (value: number) => void) => {
    return (
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="text-2xl transition-colors"
          >
            <span className={star <= value ? "text-yellow-400" : "text-gray-300"}>
              {star <= value ? "★" : "☆"}
            </span>
          </button>
        ))}
      </div>
    );
  };

  if (!showForm) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {existingReview ? 'Modifier votre avis' : 'Partager votre expérience'}
          </h3>
          <p className="text-gray-600 mb-4">
            Avez-vous suivi cette formation ? Laissez votre avis pour aider les autres étudiants !
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            {existingReview ? 'Modifier mon avis' : 'Laisser un avis'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        {existingReview ? 'Modifier votre avis' : 'Laisser un avis'}
      </h3>
      <p className="text-gray-600 mb-4">
        Formation : <span className="font-medium">{formationTitle}</span>
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Note *
          </label>
          {renderStars(rating, setRating)}
          <p className="text-sm text-gray-500 mt-1">
            Cliquez sur les étoiles pour noter (1 à 5)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Commentaire (optionnel)
          </label>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Partagez votre expérience avec cette formation..."
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            {isSubmitting ? 'Envoi en cours...' : (existingReview ? 'Mettre à jour' : 'Envoyer l\'avis')}
          </button>
          <button
            type="button"
            onClick={() => setShowForm(false)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Annuler
          </button>
        </div>
      </form>
    </div>
  );
}
