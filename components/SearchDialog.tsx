'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { SSE } from 'sse.js'
import type { CreateChatCompletionResponse } from 'openai'
import { X, Loader, User, Frown, CornerDownLeft, Search, Wand } from 'lucide-react'

function promptDataReducer(
  state: any[],
  action: {
    index?: number
    answer?: string | undefined
    status?: string
    query?: string | undefined
    type?: 'remove-last-item' | string
  }
) {
  // set a standard state to use later
  let current = [...state]

  if (action.type) {
    switch (action.type) {
      case 'remove-last-item':
        current.pop()
        return [...current]
      default:
        break
    }
  }

  // check that an index is present
  if (action.index === undefined) return [...state]

  if (!current[action.index]) {
    current[action.index] = { query: '', answer: '', status: '' }
  }

  current[action.index].answer = action.answer

  if (action.query) {
    current[action.index].query = action.query
  }
  if (action.status) {
    current[action.index].status = action.status
  }

  return [...current]
}

export function SearchDialog() {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState<string>('')
  const [question, setQuestion] = React.useState<string>('')
  const [answer, setAnswer] = React.useState<string | undefined>('')
  const eventSourceRef = React.useRef<SSE>()
  const [isLoading, setIsLoading] = React.useState(false)
  const [hasError, setHasError] = React.useState(false)
  const [promptIndex, setPromptIndex] = React.useState(0)
  const [promptData, dispatchPromptData] = React.useReducer(promptDataReducer, [])

  const cantHelp = answer?.trim() === "Sorry, I don't know how to help with that."

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && e.metaKey) {
        setOpen(true)
      }

      if (e.key === 'Escape') {
        console.log('esc')
        handleModalToggle()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  function handleModalToggle() {
    setOpen(!open)
    setSearch('')
    setQuestion('')
    setAnswer(undefined)
    setPromptIndex(0)
    dispatchPromptData({ type: 'remove-last-item' })
    setHasError(false)
    setIsLoading(false)
  }

  const handleConfirm = React.useCallback(
    async (query: string) => {
      setAnswer(undefined)
      setQuestion(query)
      setSearch('')
      dispatchPromptData({ index: promptIndex, answer: undefined, query })
      setHasError(false)
      setIsLoading(true)

      const eventSource = new SSE(`api/vector-search`, {
        headers: {
          apikey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        payload: JSON.stringify({ query }),
      })

      function handleError<T>(err: T) {
        setIsLoading(false)
        setHasError(true)
        console.error(err)
      }

      eventSource.addEventListener('error', handleError)
      eventSource.addEventListener('message', (e: any) => {
        try {
          setIsLoading(false)

          if (e.data === '[DONE]') {
            setPromptIndex((x) => {
              return x + 1
            })
            return
          }

          // 应该在代码顶部放置断言，以确保 `e.data` 符合 `string` 类型
          // 另外，请注意，使用类型断言会带来运行时错误的风险，因此对于不确定类型的值，请确保进行有效的类型验证
          const completionResponse= JSON.parse(e.data);
          const text = completionResponse.choices[0].delta?.content || "";

          setAnswer((answer) => {
            const currentAnswer = answer ?? ''

            dispatchPromptData({
              index: promptIndex,
              answer: currentAnswer + text,
            })

            return (answer ?? '') + text
          })
        } catch (err) {
          handleError(err)
        }
      })

      eventSource.stream()

      eventSourceRef.current = eventSource

      setIsLoading(true)
    },
    [promptIndex, promptData]
  )

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault()
    console.log(search)

    handleConfirm(search)
  }

  return (
    <>
      
      <button
        onClick={() => setOpen(true)}
        className="text-base flex gap-2 items-center px-4 py-3 z-50 relative 
        text-slate-500 dark:text-slate-400  hover:text-slate-700 dark:hover:text-slate-300
        transition-colors
        rounded-full
        dark:bg-slate-800
        dark:hover:bg-slate-700
        bg-white/50 backdrop-blur-sm hover:bg-white/80
        border border-slate-200 dark:border-slate-500 hover:border-slate-300 dark:hover:border-slate-500
        w-full
        md:min-w-[580px] "
      >
        <Search width={15} />
        <span className="border border-l h-5"></span>
        <span className="inline-block ml-4">请输入法律问题</span>
        <kbd
          className="absolute right-3 top-4
          pointer-events-none inline-flex h-5 select-none items-center gap-1
          rounded border border-slate-100 bg-slate-100 px-1.5
          font-mono text-[10px] font-medium
          text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400
          opacity-100 "
        >
          <span className="text-xs">⌘</span>K
        </kbd>{' '}
      </button>
      <Dialog open={open}>
        <DialogContent className="sm:max-w-[850px] text-black">
          <DialogHeader>
            <DialogTitle>AI 法律助手</DialogTitle>
            <DialogDescription>
              我是您的法律助手，请输入您想查询的问题
            </DialogDescription>
            <hr />
            <button className="absolute top-0 right-2 p-2" onClick={() => setOpen(false)}>
              <X className="h-4 w-4 dark:text-gray-100" />
            </button>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4 text-slate-700">
              {question && (
                <div className="flex gap-4">
                  <span className="bg-slate-100 dark:bg-slate-300 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <User width={18} />{' '}
                  </span>
                  <p className="mt-0.5 font-semibold text-slate-700 dark:text-slate-100">
                    {question}
                  </p>
                </div>
              )}

              {isLoading && (
                <div className="animate-spin relative flex w-5 h-5 ml-2">
                  <Loader />
                </div>
              )}

              {hasError && (
                <div className="flex items-center gap-4">
                  <span className="bg-red-100 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Frown width={18} />
                  </span>
                  <span className="text-slate-700 dark:text-slate-100">
                    服务器繁忙，请稍后再试! 或者<a href="https://github.com/lvwzhen/law-cn-ai" target='_blank' className='underline underline-offset-4 decoration-slate-400/50 hover:text-indigo-500 hover:decoration-indigo-500'>自行部署</a>
                  </span>
                </div>
              )}

              {answer && !hasError ? (
                <div className="flex items-center gap-4 dark:text-white">
                  <span className="bg-green-500 p-2 w-8 h-8 rounded-full text-center flex items-center justify-center">
                    <Wand width={18} className="text-white" />
                  </span>
                  <h3 className="font-semibold">Answer:</h3>
                  {answer}
                </div>
              ) : null}

              <div className="relative">
                <Input
                  placeholder="输入法律问题..."
                  name="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="col-span-3"
                />
                <CornerDownLeft
                  className={`absolute top-3 right-5 h-4 w-4 text-gray-300 transition-opacity ${
                    search ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              </div>
              <div className="text-xs text-gray-500 md:flex space-y-2 md:space-y-0 gap-2 dark:text-gray-100">
                Or try:{' '}
                <button
                  type="button"
                  className="px-1.5 py-0.5
                  bg-slate-50 dark:bg-gray-500  
                  hover:bg-slate-100 dark:hover:bg-gray-600
                  rounded border border-slate-200 dark:border-slate-600
                  transition-colors"
                  onClick={(_) =>
                    setSearch('离婚需要双方同意吗？')
                  }
                >
                  离婚需要双方同意吗？
                </button>
                <button
                  type="button"
                  className="px-1.5 py-0.5
                  bg-slate-50 dark:bg-gray-500
                  hover:bg-slate-100 dark:hover:bg-gray-600
                  rounded border border-slate-200 dark:border-slate-600
                  transition-colors"
                  onClick={(_) =>
                    setSearch('民间借贷受国家保护的合法利息是多少？')
                  }
                >
                  民间借贷受国家保护的合法利息是多少？
                </button>
                <button
                  type="button"
                  className="px-1.5 py-0.5
                  bg-slate-50 dark:bg-gray-500
                  hover:bg-slate-100 dark:hover:bg-gray-600
                  rounded border border-slate-200 dark:border-slate-600
                  transition-colors"
                  onClick={(_) =>
                    setSearch('欠了信用卡的钱还不上要坐牢吗？')
                  }
                >
                  欠了信用卡的钱还不上要坐牢吗？
                </button>
              </div>
            </div>
            <DialogFooter>
              <div className="text-xs text-gray-500 mt-4 md:m-0 dark:text-gray-100">
                * 回答由 AI 检索法律文件后生成，不保证准确率，仅供参考学习！<a href="https://afdian.net/a/lvwzhen/plan" className='ml-1 underline decoration-wavy decoration-indigo-500 underline-offset-2 hover:text-indigo-500' target='_blank'>打赏赞助</a>
              </div>
              <Button type="submit" className="bg-red-500 block w-full md:w-auto md:inline-block">
                Ask
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
