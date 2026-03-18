import React from 'react';
import { Drawer } from 'vaul';
import { Location } from '../../types';
import DetailsModal from '../DetailsModal';

interface MobileDetailsDrawerProps {
  location: Location | null;
  onClose: () => void;
}

const MobileDetailsDrawer: React.FC<MobileDetailsDrawerProps> = ({ location, onClose }) => {
  return (
    <Drawer.Root open={!!location} onOpenChange={(open) => !open && onClose()}>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 z-[4000] bg-background/55 backdrop-blur-md" />
        <Drawer.Content className="fixed bottom-0 left-0 right-0 z-[5000] mt-24 flex h-[90%] flex-col rounded-t-[2.5rem] border-t border-border/70 bg-background/85 backdrop-blur-2xl outline-none">
          <div className="flex-1 overflow-y-auto rounded-t-[2.5rem] p-4 no-scrollbar">
            <div className="mx-auto mb-7 h-1.5 w-12 flex-shrink-0 rounded-full bg-muted" />
            {location && (
               <div className="max-w-md mx-auto">
                  <DetailsModal location={location} onClose={onClose} isInline />
               </div>
            )}
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default MobileDetailsDrawer;
