import Image from 'next/image';
import { useLanguage } from '@/context/LanguageContext';
import type { TeamMember } from '@/types';
import styles from './TeamCard.module.css';

interface Props {
  member: TeamMember;
}

export default function TeamCard({ member }: Props) {
  const { t, lang } = useLanguage();

  const name     = lang === 'kg' ? member.nameKg     : member.nameRu;
  const position = lang === 'kg' ? member.positionKg : member.positionRu;

  // Initials for placeholder
  const initials = name.split(' ').map(p => p[0]).slice(0, 2).join('');

  return (
    <article className={styles.card}>
      {/* Photo */}
      <div className={styles.imgWrap}>
        {member.photo ? (
          <Image
            src={member.photo}
            alt={name}
            fill
            className={styles.img}
            sizes="(max-width: 640px) 50vw, 25vw"
          />
        ) : (
          <div className={styles.imgPlaceholder} aria-hidden>{initials}</div>
        )}
        <div className={styles.overlay} aria-hidden />
      </div>

      {/* Info */}
      <div className={styles.body}>
        <h3 className={styles.name}>{name}</h3>
        <p className={styles.position}>{position}</p>
        {member.experience && (
          <p className={styles.experience}>
            {t.team.experience}: {member.experience}
          </p>
        )}

        {/* Social links */}
        {(member.instagram || member.telegram || member.whatsapp) && (
          <div className={styles.socials}>
            {member.instagram && (
              <a href={member.instagram} className={styles.socialBtn} target="_blank" rel="noopener noreferrer" aria-label="Instagram">IG</a>
            )}
            {member.telegram && (
              <a href={member.telegram} className={styles.socialBtn} target="_blank" rel="noopener noreferrer" aria-label="Telegram">TG</a>
            )}
            {member.whatsapp && (
              <a href={member.whatsapp} className={styles.socialBtn} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">WA</a>
            )}
          </div>
        )}
      </div>
    </article>
  );
}
