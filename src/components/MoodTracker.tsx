import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Loader2, RotateCcw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';

interface MoodOption {
  id: string;
  emoji: string;
  label: string;
  description: string;
  color: string;
}

interface MoodTrackerProps {
  onMoodSelect?: (mood: MoodOption) => Promise<void> | void;
  initialMood?: string;
  disabled?: boolean;
  showDescription?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

type ComponentState = 'idle' | 'loading' | 'success' | 'error';

const MoodTracker: React.FC<MoodTrackerProps> = ({
  onMoodSelect,
  initialMood,
  disabled = false,
  showDescription = true,
  size = 'md'
}) => {
  const [selectedMood, setSelectedMood] = useState<string | null>(initialMood || null);
  const [state, setState] = useState<ComponentState>('idle');
  const [error, setError] = useState<string>('');

  const moods: MoodOption[] = [
    {
      id: 'happy',
      emoji: '😊',
      label: 'Senang',
      description: 'Merasa bahagia dan positif',
      color: 'text-green-500'
    },
    {
      id: 'neutral',
      emoji: '😐',
      label: 'Biasa',
      description: 'Merasa biasa saja, tidak ada yang spesial',
      color: 'text-yellow-500'
    },
    {
      id: 'sad',
      emoji: '😞',
      label: 'Sedih',
      description: 'Merasa down atau kecewa',
      color: 'text-blue-500'
    }
  ];

  const sizeClasses = {
    sm: {
      emoji: 'text-3xl',
      card: 'p-3',
      spacing: 'gap-2',
      button: 'h-16 w-16'
    },
    md: {
      emoji: 'text-4xl',
      card: 'p-4',
      spacing: 'gap-3',
      button: 'h-20 w-20'
    },
    lg: {
      emoji: 'text-5xl',
      card: 'p-6',
      spacing: 'gap-4',
      button: 'h-24 w-24'
    }
  };

  const handleMoodSelect = async (mood: MoodOption) => {
    if (disabled || state === 'loading') return;

    setSelectedMood(mood.id);
    setState('loading');
    setError('');

    try {
      if (onMoodSelect) {
        await onMoodSelect(mood);
      }
      setState('success');
      
      // Reset to idle after success message
      setTimeout(() => {
        setState('idle');
      }, 2000);
    } catch (err) {
      setState('error');
      setError(err instanceof Error ? err.message : 'Gagal menyimpan mood');
      setSelectedMood(null);
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent, mood: MoodOption) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleMoodSelect(mood);
    }
  };

  const resetState = () => {
    setState('idle');
    setError('');
    setSelectedMood(null);
  };

  const currentSizeClasses = sizeClasses[size];

  return (
    <Card className={`w-full max-w-md mx-auto ${currentSizeClasses.card} bg-background border-border`}>
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center space-y-2">
          <h2 className="text-xl font-semibold text-foreground">
            Mood hari ini?
          </h2>
          <p className="text-sm text-muted-foreground">
            Lacak mood kamu untuk memahami pola emosi dengan lebih baik
          </p>
        </div>

        {/* Mood Options */}
        <div className={`flex justify-center items-center ${currentSizeClasses.spacing}`}>
          {moods.map((mood) => (
            <motion.button
              key={mood.id}
              onClick={() => handleMoodSelect(mood)}
              onKeyDown={(e) => handleKeyDown(e, mood)}
              disabled={disabled || state === 'loading'}
              className={`
                ${currentSizeClasses.button}
                relative rounded-full border-2 transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
                disabled:opacity-50 disabled:cursor-not-allowed
                ${selectedMood === mood.id
                  ? 'border-primary bg-primary/10 shadow-lg'
                  : 'border-border bg-card hover:border-primary/50 hover:bg-accent'
                }
              `}
              whileHover={!disabled && state !== 'loading' ? { scale: 1.05 } : {}}
              whileTap={!disabled && state !== 'loading' ? { scale: 0.95 } : {}}
              aria-label={`Pilih mood ${mood.label} - ${mood.description}`}
              role="radio"
              aria-checked={selectedMood === mood.id}
            >
              <span className={`${currentSizeClasses.emoji} block`}>
                {mood.emoji}
              </span>
              
              {/* Loading indicator */}
              <AnimatePresence>
                {state === 'loading' && selectedMood === mood.id && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 flex items-center justify-center bg-background/80 rounded-full"
                  >
                    <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Success indicator */}
              <AnimatePresence>
                {state === 'success' && selectedMood === mood.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0 }}
                    className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1"
                  >
                    <Check className="h-3 w-3" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          ))}
        </div>

        {/* Mood Labels */}
        {showDescription && (
          <div className="flex justify-center items-center gap-3">
            {moods.map((mood) => (
              <div key={`${mood.id}-label`} className="text-center flex-1">
                <p className={`text-sm font-medium ${
                  selectedMood === mood.id ? mood.color : 'text-muted-foreground'
                }`}>
                  {mood.label}
                </p>
                {selectedMood === mood.id && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="text-xs text-muted-foreground mt-1"
                  >
                    {mood.description}
                  </motion.p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Success Message */}
        <AnimatePresence>
          {state === 'success' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-center"
            >
              <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
                <Check className="h-4 w-4 text-green-600" />
                <div className="text-green-800 dark:text-green-200">
                  Mood berhasil disimpan!
                </div>
              </Alert>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error Message */}
        <AnimatePresence>
          {state === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="space-y-2"
            >
              <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <div className="text-red-800 dark:text-red-200">
                  {error || 'Ada yang salah. Coba lagi ya!'}
                </div>
              </Alert>
              <Button
                variant="outline"
                size="sm"
                onClick={resetState}
                className="w-full"
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Coba Lagi
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty State */}
        {!selectedMood && state === 'idle' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-2"
          >
            <p className="text-sm text-muted-foreground">
              Pilih emoji yang mewakili perasaan kamu saat ini
            </p>
          </motion.div>
        )}
      </div>
    </Card>
  );
};

export default MoodTracker;