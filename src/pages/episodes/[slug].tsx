import Image from 'next/image'
import Link from 'next/link'
import Head from 'next/head'
import { GetStaticPaths } from 'next'
import { useContext } from 'react'

import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import parseISO from 'date-fns/parseISO'

import { PlayerContext } from '../../contexts/contextPlayer'
import { api } from '../../services/api'
import { ConvertDurationToTimeString } from '../../utils/ConvertDurationToTimeString'

import styles from './episode.module.scss'

type Episode = {
    id: string;
    title: string;
    description: string;
    thumbnail: string;
    members: string;
    duration: number;
    durationAsString: string;
    url: string;
    publishedAt: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
    const { play } = useContext(PlayerContext)

    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title} | Podcaster</title>
            </Head>
            <div className={styles.thumbnailContainer}>
                <Link href="/">
                    <button type-="button">
                        <img src="/arrow-left.svg" alt="Voltar" />
                    </button>
                </Link>
                <Image
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />
                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio" />
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div
                className={styles.description}
                dangerouslySetInnerHTML={{ __html: episode.description }}
            />
        </div >
    )
}

export const getStaticPaths: GetStaticPaths = async () => {
    const { data } = await api.get('episodes', {
        params: {
            _limit: 12,
            _sort: 'published_at',
            _order: 'desc'
        }
    })

    const paths = data.map(episode => {
        return {
            params: {
                slug: episode.id
            }
        }
    })

    return {
        paths,
        fallback: 'blocking'
    }
}

export const getStaticProps = async (ctx) => {
    const { slug } = ctx.params
    const { data } = await api.get(`/episodes/${slug}`)

    const { id, title, thumbnail, members, published_at, description, file } = data

    const episode = {
        id,
        title,
        thumbnail,
        members,
        publishedAt: format(parseISO(published_at), 'd MMM yy', { locale: ptBR }),
        duration: file.duration,
        durationAsString: ConvertDurationToTimeString(file.duration),
        description,
        url: file.url
    }

    return {
        props: {
            episode,
        },
        revalidate: 60 * 60 * 24,
    }
}