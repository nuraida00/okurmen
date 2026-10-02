import SectionTitle from '@/components/ui/SectionTitle';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import TeamCard from './TeamCard';
import { useLanguage } from '@/context/LanguageContext';
import type { TeamMember } from '@/types';
import styles from './TeamSection.module.css';

interface Props {
  members: TeamMember[];
  showViewAll?: boolean;
}

export default function TeamSection({ members, showViewAll = true }: Props) {
  const { t, lang } = useLanguage();

  return (
    <section className={styles.section} id="team">
      <div className="container">
        <SectionTitle
          tag={lang === 'kg' ? 'Команда' : 'Команда'}
          title={t.team.sectionTitle}
          subtitle={t.team.sectionSubtitle}
        />

        {members.length === 0 ? (
          <EmptyState title={t.team.empty} description={t.common.soonContent} />
        ) : (
          <>
            <div className={styles.scrollWrap}>
              <div className={styles.grid}>
                {members.map(m => (
                  <TeamCard key={m.id} member={m} />
                ))}
              </div>
            </div>

            {showViewAll && members.length > 4 && (
              <div className={styles.footer}>
                <Button as="a" href="/team" variant="outline" size="lg">
                  {t.common.viewAll}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
