interface Stats {
    hp: number,
    xp: number,
    level: number
}

interface StatsCardProps {
    stats: Stats
}

export const StatsCard: React.FC<StatsCardProps> = ({ stats }) => {
    return (
        <div >
            <p>HP: {stats.hp}</p>
            <p>XP: {stats.xp}</p>
            <p>Level: {stats.level}</p>
        </div>
    )
}