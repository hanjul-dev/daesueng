import { OVERVIEW_CARDS, PROPERTY_CONTENT } from '../../content/property'
import { Badge } from '../ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card'

export default function OverviewSection() {
  return (
    <section
      id="overview"
      className="layout-shell layout-shell--wide scroll-mt-28 pb-10 lg:pb-16"
    >
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)] 2xl:grid-cols-[minmax(0,1.16fr)_minmax(360px,0.84fr)]">
        <Card className="rounded-[40px]">
          <CardHeader className="space-y-4">
            <Badge variant="secondary">매물 소개</Badge>
            <CardTitle className="max-w-3xl text-3xl sm:text-[40px]">
              {PROPERTY_CONTENT.overviewTitle}
            </CardTitle>
            <CardDescription className="max-w-3xl text-[15px]">
              {PROPERTY_CONTENT.overviewDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3">
            {PROPERTY_CONTENT.overviewNarrative.map((item) => (
              <div
                key={item}
                className="rounded-[26px] border border-[color:var(--theme-border)] bg-white/72 px-5 py-4 text-sm leading-7 text-[color:var(--theme-muted-foreground)]"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {OVERVIEW_CARDS.map((item) => (
            <Card key={item.label} className="rounded-[34px]">
              <CardHeader className="space-y-2">
                <Badge>{item.label}</Badge>
                <CardTitle className="text-[26px]">{item.value}</CardTitle>
                <CardDescription className="text-[15px]">{item.description}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
