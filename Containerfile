#   file: Containerfile
# author: simshadows <contact@simshadows.com>
#
# The image is for updating dependencies and running the dev server,
# which is why we mount the directory instead of copy it.

FROM node:25-bookworm

RUN apt update
RUN apt install -y vim python3

# repo folder to be a mount point
RUN mkdir -p /repo
RUN chown node /repo
WORKDIR /repo

USER node

# Install my dotfiles
RUN git clone https://github.com/simshadows/sims-dotfiles.git ~/dotfiles
RUN ~/dotfiles/setup.sh minimal

# Install Claude Code
RUN curl -fsSL https://claude.ai/install.sh | bash
RUN echo '' >> ~/.bashrc
RUN echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
# .claude folder to be a mount point
RUN mkdir -p /home/node/.claude

EXPOSE 8000/tcp
ENTRYPOINT sleep infinity
