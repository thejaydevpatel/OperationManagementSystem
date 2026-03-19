// "use client";

// import { Box, Button, Typography, Stack } from "@mui/material";
// import Image from "next/image";
// import Link from "next/link";

// interface EmptyStateProps {
//   title: string;
//   description: string;
//   buttonText: string;
//   buttonHref: string;
//   illustration?: string;
// }

// export default function EmptyState({
//   title,
//   description,
//   buttonText,
//   buttonHref,
//   illustration = "http://localhost:3000/images/no-record-backend/no-record-found-backend.svg", // put your illustration in public folder
// }: EmptyStateProps) {
//   return (
//     <Box
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       justifyContent="center"
//       textAlign="center"
//       minHeight="60vh"
//       px={2}
//       paddingBottom={30}
//     >
//       {illustration && (
//         <Box mb={3}>
//           <Image
//             src={illustration}
//             alt="Empty state illustration"
//             width={500}
//             height={160}
//           />
//         </Box>
//       )}
//       <Typography variant="h5" gutterBottom>
//         {title}
//       </Typography>
//       <Typography variant="body2" color="text.secondary" maxWidth={400} mb={3}>
//         {description}
//       </Typography>
//       <Stack direction="row" spacing={2}>
//         <Link href={buttonHref} passHref legacyBehavior>
//           <Button variant="contained" color="primary" component="a">
//             {buttonText}
//           </Button>
//         </Link>
//       </Stack>
//     </Box>
//   );
// }


"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  illustration?: string;
}

export default function EmptyState({
  title,
  description,
  buttonText,
  buttonHref,
  illustration = "/images/no-record-backend/no-record-found-backend.svg",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[60vh] px-4 pb-20">
      
      {illustration && (
        <div className="mb-6">
          <Image
            src={illustration}
            alt="Empty state illustration"
            width={500}
            height={160}
            className="object-contain"
          />
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">
        {title}
      </h2>

      <p className="text-muted-foreground max-w-md mb-6 text-sm">
        {description}
      </p>

      <div className="flex gap-2">
        <Link href={buttonHref}>
          <Button>
            {buttonText}
          </Button>
        </Link>
      </div>

    </div>
  );
}