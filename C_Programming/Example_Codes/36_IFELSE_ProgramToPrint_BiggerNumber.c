#include<stdio.h>
int main(void){
    int a, b;
     printf("Enter two numbers : ");
    scanf("%d%d", &a, &b);
    if (a>b)
        printf("Bigger number = %d", a);
    else
        printf("Bigger number = %d", b);
    return 0;


}