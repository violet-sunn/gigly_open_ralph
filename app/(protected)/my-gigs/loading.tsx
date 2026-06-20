import { Stack } from '@/app/components/layout/Stack'
import { Grid } from '@/app/components/layout/Grid'
import { Panel } from '@/app/components/layout/Panel'

/**
 * «Мои гиги» loading boundary — the prototype's 2-column skeleton grid, shown while getMyGigs resolves server-side.
 * Token-pure (surface tokens + Tailwind utilities, no colour/px literals); not a composed screen.
 */
export default function Loading() {
  return (
    <Stack gap={4}>
      <Grid columns={2} gap={4}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Panel key={i} surface={2} radius="lg" padding={4} className="h-64 animate-pulse" />
        ))}
      </Grid>
    </Stack>
  )
}
