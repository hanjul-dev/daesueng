import { Building2, CarFront, MapPinned } from 'lucide-react'
import { PROPERTY_CONTENT, SELLING_POINTS } from '../../content/property'
import { Badge } from '../ui/badge'
import { Card, CardDescription, CardHeader, CardTitle } from '../ui/card'

const POINT_ICONS = [Building2, MapPinned, CarFront]

export default function SellingPointsSection() {
  return (
    <section className="layout-shell pb-10 lg:pb-16">
      <div className="mb-6 flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
        <div className="space-y-3">
          <Badge variant="secondary">외관 핵심 요약</Badge>
          <h2 className="text-3xl font-semibold tracking-[-0.04em] text-[color:var(--theme-foreground)] sm:text-4xl">
            처음 볼 때 바로 판단해야 할 세 가지
          </h2>
        </div>
        <p className="max-w-2xl text-sm leading-7 text-[color:var(--theme-muted-foreground)] sm:text-[15px]">
          {PROPERTY_CONTENT.contactLine}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:gap-5">
        {SELLING_POINTS.map((point, index) => {
          const Icon = POINT_ICONS[index]

          return (
            <Card key={point.title} className="rounded-[32px]">
              <CardHeader className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--theme-accent-muted)]">
                  <Icon className="h-5 w-5 text-[color:var(--theme-foreground)]" />
                </div>
                <div className="space-y-2">
                  <CardTitle className="text-[28px]">{point.title}</CardTitle>
                  <CardDescription className="text-[15px]">{point.description}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
