import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Calendar, Video, Compass, Plane } from 'lucide-react';
import { birthdayContent } from '../data/birthdayContent';
import { useAudioCoordinator } from '../context/AudioCoordinator';

export const StoryTimeline: React.FC = () => {
  const { memories } = birthdayContent;
  const { setVideoPlaying } = useAudioCoordinator();

  return (
    <section
      id="story-timeline"
      className="relative min-h-screen py-24 px-4 sm:px-6 bg-[#FFF9F5] overflow-hidden"
    >
      {/* Decorative gradient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#FCE7F0]/50 rounded-full blur-[130px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F7C8D9]/40 border border-[#F7C8D9] text-[#75445C] text-xs font-semibold uppercase tracking-wider mb-3"
          >
            <Compass className="w-3.5 h-3.5 text-[#D982A5]" />
            Long Distance Journey
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#2A1722] tracking-tight"
          >
            Miles Apart, Close at Heart
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-sm sm:text-base text-[#75445C] mt-3 font-normal"
          >
            Every chapter of our story has conquered miles, time zones, and boarding gates — only to prove that our hearts were always intertwined.
          </motion.p>
        </div>

        {/* Long-Distance Love Connection Stats Card */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-20 max-w-4xl mx-auto">
          {[
            { label: 'Distance Apart', val: 'Miles Away', sub: '0 Miles in Spirit', icon: Plane },
            { label: 'Daily Calls', val: 'Endless Hours', sub: 'Every Morning & Night', icon: Heart },
            { label: 'Special Date', val: 'October 23', sub: "Snehuu's Birthday", icon: Calendar },
            { label: 'Our Love', val: 'Infinite', sub: 'Forever & Always', icon: Compass },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="glass-panel p-4 rounded-2xl text-center border border-white/80 shadow-xs hover:shadow-md transition-shadow"
              >
                <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-[#FCE7F0] flex items-center justify-center text-[#D982A5]">
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-lg sm:text-xl font-bold font-serif text-[#2A1722]">{stat.val}</div>
                <div className="text-xs font-semibold text-[#D982A5] mt-0.5">{stat.label}</div>
                <div className="text-[11px] text-[#75445C]/70 mt-1">{stat.sub}</div>
              </div>
            );
          })}
        </div>

        {/* Interactive Vertical Timeline */}
        <div className="relative">
          {/* Central Line */}
          <div className="hidden md:block absolute left-1/2 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#F7C8D9] via-[#D982A5] to-[#F7C8D9] -translate-x-1/2" />
          <div className="md:hidden absolute left-5 top-4 bottom-4 w-0.5 bg-gradient-to-b from-[#F7C8D9] via-[#D982A5] to-[#F7C8D9]" />

          <div className="space-y-12 sm:space-y-16">
            {memories.map((memory, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={memory.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={`relative flex flex-col md:flex-row items-center ${
                    isEven ? 'md:flex-row-reverse' : ''
                  }`}
                >
                  {/* Timeline Glowing Node */}
                  <div className="absolute left-5 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white border-4 border-[#D982A5] shadow-md z-20 flex items-center justify-center">
                    <Heart className="w-3 h-3 text-[#D982A5] fill-[#D982A5]" />
                  </div>

                  {/* Content Card Side */}
                  <div className="w-full pl-12 md:pl-0 md:w-1/2 md:px-8">
                    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-[#F7C8D9]/60 hover:shadow-xl transition-all">
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-xs font-semibold text-[#D982A5] uppercase tracking-wider flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          {memory.date || `Chapter ${index + 1}`}
                        </span>
                        {memory.category && (
                          <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-[#FCE7F0] text-[#75445C] font-medium">
                            {memory.category}
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#2A1722] mb-3">
                        {memory.title}
                      </h3>

                      <p className="text-sm sm:text-base text-[#75445C] leading-relaxed">
                        {memory.caption}
                      </p>

                      {/* Optional Video Player if specified */}
                      {memory.video && (
                        <div className="mt-4 pt-4 border-t border-[#F7C8D9]/40">
                          <div className="flex items-center gap-2 text-xs font-semibold text-[#75445C] mb-2">
                            <Video className="w-4 h-4 text-[#D982A5]" /> Short Memory Clip
                          </div>
                          <video
                            src={memory.video}
                            controls
                            className="w-full rounded-xl shadow-sm max-h-56 object-cover bg-black/5"
                            onPlay={() => setVideoPlaying(true)}
                            onPause={() => setVideoPlaying(false)}
                            onEnded={() => setVideoPlaying(false)}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Photo / Visual Frame Side */}
                  <div className="w-full pl-12 md:pl-0 md:w-1/2 md:px-8 mt-4 md:mt-0">
                    <div className="relative group max-w-md mx-auto">
                      <div className="p-3 bg-white rounded-2xl shadow-md border border-[#F7C8D9]/70 transform group-hover:scale-[1.02] transition-transform duration-300">
                        <img
                          src={memory.image}
                          alt={memory.title}
                          loading="lazy"
                          className="w-full aspect-[4/3] object-cover rounded-xl bg-[#FCE7F0]/30"
                          onError={(e) => {
                            // Fallback if local image not found yet
                            (e.target as HTMLImageElement).src = `/images/photo-0${(index % 6) + 1}.svg`;
                          }}
                        />
                        <div className="mt-2 text-center text-xs text-[#75445C] font-script text-base">
                          {memory.title} ♡
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};
