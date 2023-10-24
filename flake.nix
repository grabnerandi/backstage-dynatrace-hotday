{
  description = "Development environment for Backstage";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/release-23.05";
  inputs.systems.url = "github:nix-systems/default";

  outputs = {
    self,
    nixpkgs,
    flake-utils,
    systems,
  }:
    flake-utils.lib.eachSystem (import systems)
    (system: let
      pkgs = import nixpkgs {
        inherit system;
      };
    in {
      devShells.default = pkgs.mkShell {
        buildInputs = [
          pkgs.nodejs
          pkgs.nodePackages.typescript
          pkgs.nodePackages.typescript-language-server
          pkgs.yarn

          pkgs.kind
          pkgs.kubectl
          pkgs.k9s
        ];
        EDITOR = "vim";
      };
    });
}
