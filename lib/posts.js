import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const postsDirectory = path.join(process.cwd(), 'posts')

export function getSortedPostsData() {
    // posts/ 下のファイル読み込み
    const fileNames = fs.readdirSync(postsDirectory)
    const allPostsData = fileNames.map(fileName => {
        // .md を削除
        const id = fileName.replace(/\.md$/, '')

        // Markdownを文字列に
        const fullPath = path.join(postsDirectory, fileName)
        const fileContents = fs.readFileSync(fullPath, 'utf8')

        // gray-matterを使ってmetaデータを使用
        const matterResult = matter(fileContents)

        // データ連結
        return {
            id,
            ...matterResult.data
        }
    })
    // 日付で並び替え
    return allPostsData.sort(({ date: a }, { date: b }) => {
        if (a < b) {
            return 1
        } else if (a > b) {
            return -1
        } else {
            return 0
        }
    })
}


export function getAllPostIds() {
    // idをまとめた配列(要object)を作成する(動的ルーティング用)
    // 形式が決まっている。
    // params : 必須
    // id : 受け取り先のパス(ファイル名)に準じる 今回はid

    const fileNames = fs.readdirSync(postsDirectory)

    return fileNames.map(fileName => {
        return {
            params: {
                id: fileName.replace(/\.md$/, '')
            }
        }
    })
}

export async function getPostData(id) {
const fullPath = path.join(postsDirectory, `${id}.md`)
const fileContents = fs.readFileSync(fullPath, 'utf8')
const matterResult = matter(fileContents)

// markdownをHTMLに
const processedContent = await remark()
    .use(html)
    .process(matterResult.content)
const contentHtml = processedContent.toString()

return {
        id,
        contentHtml,
        ...matterResult.data
    }
}