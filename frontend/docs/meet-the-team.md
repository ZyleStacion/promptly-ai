<script setup>
import { VPTeamMembers } from 'vitepress/theme'

const members = [
    {
        avatar: 'https://github.com/giakhang2601.png',
        name: 'Khang Nguyen Huynh Gia',
        title: 'Frontend Developer',
        links: [
            { icon: 'github', link: 'https://github.com/giakhang2601' }
        ]
    },
    {
        avatar: 'https://github.com/LisforL.png',
        name: 'Linn Htin Nyo',
        title: 'Backend Developer',
        links: [
            { icon: 'github', link: 'https://github.com/LisforL' }
        ]
    },
    {
        avatar: 'https://github.com/Yethu-2.png',
        name: 'Ye Thu Aung',
        title: 'AI Developer',
        links: [
            { icon: 'github', link: 'https://github.com/Yethu-2'}
        ]
    },
    {
        avatar: 'https://github.com/ZyleStacion.png',
        name: 'Zyle Estacion',
        title: 'DevOps Engineer',
        links: [
            { icon: 'github', link: 'https://github.com/ZyleStacion'}
        ]
    }
]

</script>

# Our Team

Say hello to our awesome team.

<VPTeamMembers size="small" :members />